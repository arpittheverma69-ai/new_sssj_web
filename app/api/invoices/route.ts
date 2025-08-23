import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { invoice_number: { contains: search, mode: "insensitive" as any } },
            { buyer_name: { contains: search, mode: "insensitive" as any } },
          ],
        }
      : {};

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

    const invoice = await prisma.invoice.create({
      data: {
        invoice_number: data.invoice_number,
        invoice_date: new Date(data.invoice_date),
        transaction_type: data.transaction_type,
        input_mode: data.input_mode,
        eway_bill: data.eway_bill,
        buyer_id: data.buyer_id,
        buyer_name: data.buyer_name,
        buyer_address: data.buyer_address,
        buyer_gstin: data.buyer_gstin,
        buyer_state_code: data.buyer_state_code,
        tax_type: data.tax_type,
        total_invoice_value: data.total_invoice_value,
        line_items: {
          create: data.line_items.map((item: any) => ({
            hsn_sac_code: item.hsn_sac_code,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            rate: item.rate,
            taxable_value: item.taxable_value,
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
