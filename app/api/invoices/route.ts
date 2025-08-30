import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null, // Exclude soft-deleted records
    };

    if (search) {
      where.OR = [
        { invoice_number: { contains: search, mode: "insensitive" } },
        { buyer_name: { contains: search, mode: "insensitive" } },
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          customer: true,
          line_items: {
            include: {
              taxes: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Normalize payload keys from client
    const transactionType: string | undefined = data.transaction_type ?? data.type;
    const inputMode: string | undefined = data.input_mode ?? data.mode;
    const buyerStateCodeRaw = data.buyer_state_code;
    const buyerStateCode = buyerStateCodeRaw === undefined || buyerStateCodeRaw === null
      ? null
      : Number.isNaN(Number(buyerStateCodeRaw))
        ? null
        : Number(buyerStateCodeRaw);

    if (!transactionType) {
      return NextResponse.json({ error: "transaction_type is required" }, { status: 400 });
    }

    // Determine tax_type and invoice prefix from settings based on transaction type
    const settings = await prisma.invoiceSetting.findFirst();

    // Fallback defaults if settings missing
    const prefixRetail = settings?.prefix_retail ?? settings?.invoice_prefix ?? "JVJ/D/";
    const prefixInterCity = settings?.prefix_inter_city ?? prefixRetail;
    const prefixOuterState = settings?.prefix_outer_state ?? "JVJ/S/";

    const numberDigits = settings?.number_digits ?? 3;
    const startingNumber = settings?.starting_number ?? 1;

    let taxType: string = "CGST+SGST";
    let chosenPrefix: string = prefixRetail;
    const txLower = String(transactionType).toLowerCase();
    if (txLower === "outer_state") {
      chosenPrefix = prefixOuterState;
      taxType = "IGST";
    } else if (txLower === "inter_state") {
      chosenPrefix = prefixInterCity;
      taxType = "IGST";
    } else {
      // retail or default
      taxType = "CGST+SGST";
      chosenPrefix = prefixRetail;
    }

    // Generate invoice number if not provided
    let invoiceNumber: string = data.invoice_number;
    if (!invoiceNumber || typeof invoiceNumber !== "string" || invoiceNumber.trim() === "") {
      // Find last sequence with same prefix
      const last = await prisma.invoice.findFirst({
        where: { invoice_number: { startsWith: chosenPrefix } as any },
        orderBy: { created_at: "desc" },
        select: { invoice_number: true },
      });

      const lastSeq = (() => {
        const raw = last?.invoice_number || "";
        const match = raw.replace(chosenPrefix, "");
        const num = parseInt(match, 10);
        return Number.isFinite(num) ? num : undefined;
      })();

      const nextSeq = (lastSeq ?? startingNumber - 1) + 1;
      const padded = String(nextSeq).padStart(numberDigits, "0");
      invoiceNumber = `${chosenPrefix}${padded}`;
    }

    const invoice = await prisma.invoice.create({
      data: {
        invoice_number: invoiceNumber,
        invoice_date: new Date(data.invoice_date),
        transaction_type: transactionType!,
        input_mode: inputMode!,
        eway_bill: data.eway_bill,
        buyer_id: data.buyer_id,
        buyer_name: data.buyer_name,
        buyer_address: data.buyer_address,
        buyer_gstin: data.buyer_gstin,
        buyer_state_code: buyerStateCode,
        tax_type: taxType,
        total_invoice_value: parseFloat(data.total_invoice_value) || 0,
        roundoff: parseFloat(data.roundoff) || 0,
        flagged: false,
        line_items: {
          create: data.line_items.map((item: any) => ({
            hsn_sac_code: item.hsn_sac_code,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            rate: item.rate,
            taxable_value: item.taxable_value,
            roundoff: item.roundoff || 0,
            taxes: {
              create: item.taxes.map((tax: any) => ({
                tax_name: tax.tax_name,
                tax_rate: tax.tax_rate,
                tax_amount: tax.tax_amount,
              })),
            },
          })),
        },
      },
      include: {
        customer: true,
        line_items: {
          include: {
            taxes: true,
          },
        },
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
