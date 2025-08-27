import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        customer: true,
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
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const invoiceId = parseInt(params.id);

    // If only flagged is being updated, perform a lightweight update
    if (Object.keys(data).length === 1 && Object.prototype.hasOwnProperty.call(data, 'flagged')) {
      const updated = await prisma.invoice.update({
        where: { id: invoiceId },
        data: { flagged: Boolean(data.flagged) },
        include: {
          customer: true,
          line_items: { include: { taxes: true } },
        },
      });
      return NextResponse.json(updated);
    }

    // Otherwise, treat as a full update: replace line items and taxes
    await prisma.lineItemTax.deleteMany({
      where: {
        line_item: { invoice_id: invoiceId },
      },
    });

    await prisma.lineItem.deleteMany({ where: { invoice_id: invoiceId } });

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        invoice_number: data.invoice_number,
        invoice_date: data.invoice_date ? new Date(data.invoice_date) : undefined,
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
        flagged: typeof data.flagged === 'boolean' ? data.flagged : undefined,
        line_items: data.line_items
          ? {
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
            }
          : undefined,
      },
      include: {
        customer: true,
        line_items: { include: { taxes: true } },
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = parseInt(params.id);

    // Delete related records first
    await prisma.lineItemTax.deleteMany({
      where: {
        line_item: {
          invoice_id: invoiceId,
        },
      },
    });

    await prisma.lineItem.deleteMany({
      where: { invoice_id: invoiceId },
    });

    await prisma.invoice.delete({
      where: { id: invoiceId },
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
