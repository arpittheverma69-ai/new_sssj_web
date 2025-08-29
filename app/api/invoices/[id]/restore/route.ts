import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { softDeleteUtils } from "@/lib/softDelete";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = parseInt(params.id);

    // First restore the invoice
    const restoredInvoice = await softDeleteUtils.restore(
      prisma.invoice,
      { id: invoiceId }
    );

    // Then restore all related line items and taxes
    const lineItems = await softDeleteUtils.findDeleted(
      prisma.lineItem,
      { where: { invoice_id: invoiceId } }
    );

    for (const lineItem of lineItems) {
      await softDeleteUtils.restore(prisma.lineItem, { id: lineItem.id });
      
      // Restore taxes for this line item
      const taxes = await softDeleteUtils.findDeleted(
        prisma.lineItemTax,
        { where: { line_item_id: lineItem.id } }
      );

      for (const tax of taxes) {
        await softDeleteUtils.restore(prisma.lineItemTax, { id: tax.id });
      }
    }

    return NextResponse.json({
      message: "Invoice and related items restored successfully",
      invoice: restoredInvoice,
    });
  } catch (error) {
    console.error("Error restoring invoice:", error);
    return NextResponse.json(
      { error: "Failed to restore invoice" },
      { status: 500 }
    );
  }
}
