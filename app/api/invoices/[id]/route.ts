import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            state: true,
          },
        },
        line_items: {
          include: {
            taxes: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const data = await request.json();

    // Validate required fields
    if (!data.transaction_type || !data.buyer_name || !data.line_items || data.line_items.length === 0) {
      return NextResponse.json(
        { error: "Transaction type, buyer name, and at least one line item are required" },
        { status: 400 }
      );
    }

    // Normalize data similar to POST
    const transactionType = data.transaction_type ?? data.type;
    const inputMode = data.input_mode ?? data.mode;
    const buyerStateCodeRaw = data.buyer_state_code;
    const buyerStateCode = buyerStateCodeRaw === undefined || buyerStateCodeRaw === null
      ? null
      : Number.isNaN(Number(buyerStateCodeRaw))
        ? null
        : Number(buyerStateCodeRaw);

    // Delete existing line items and their taxes
    await prisma.lineItem.deleteMany({
      where: { invoice_id: id }
    });

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        invoice_number: data.invoice_number,
        invoice_date: data.invoice_date ? new Date(data.invoice_date) : undefined,
        transaction_type: transactionType,
        input_mode: inputMode,
        eway_bill: data.eway_bill,
        buyer_id: data.buyer_id,
        buyer_name: data.buyer_name,
        buyer_address: data.buyer_address,
        buyer_gstin: data.buyer_gstin,
        buyer_state_code: buyerStateCode,
        tax_type: data.tax_type,
        total_invoice_value: parseFloat(data.total_invoice_value) || 0,
        roundoff: parseFloat(data.roundoff) || 0,
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
        customer: {
          include: {
            state: true,
          },
        },
        line_items: {
          include: {
            taxes: true,
          },
        },
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to update invoice";
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        errorMessage = "Invoice number already exists. Please use a different invoice number.";
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage = "Invalid customer or state reference. Please check your data.";
      } else if (error.message.includes('required')) {
        errorMessage = "Missing required fields. Please check your input.";
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    // Soft delete the invoice (this will automatically set deletedAt due to Prisma extension)
    await prisma.invoice.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}