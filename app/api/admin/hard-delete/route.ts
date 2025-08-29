import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { softDeleteUtils } from "@/lib/softDelete";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const model = searchParams.get('model');
    const id = searchParams.get('id');

    if (!model || !id) {
      return NextResponse.json({ error: "Model and ID parameters are required" }, { status: 400 });
    }

    const recordId = parseInt(id);

    switch (model.toLowerCase()) {
      case 'customer':
        await softDeleteUtils.hardDelete(prisma.customer, { id: recordId });
        break;
      case 'invoice':
        // For invoices, we need to hard delete related records first
        const invoice = await softDeleteUtils.findDeleted(prisma.invoice, {
          where: { id: recordId },
          include: { line_items: { include: { taxes: true } } }
        });
        
        if (invoice.length > 0) {
          for (const lineItem of invoice[0].line_items) {
            for (const tax of lineItem.taxes) {
              await softDeleteUtils.hardDelete(prisma.lineItemTax, { id: tax.id });
            }
            await softDeleteUtils.hardDelete(prisma.lineItem, { id: lineItem.id });
          }
        }
        await softDeleteUtils.hardDelete(prisma.invoice, { id: recordId });
        break;
      case 'user':
        await softDeleteUtils.hardDelete(prisma.user, { id: recordId });
        break;
      case 'taxrate':
        await softDeleteUtils.hardDelete(prisma.taxRate, { id: recordId });
        break;
      default:
        return NextResponse.json({ error: "Invalid model specified" }, { status: 400 });
    }

    return NextResponse.json({ message: `${model} permanently deleted` });
  } catch (error) {
    console.error("Error permanently deleting record:", error);
    return NextResponse.json(
      { error: "Failed to permanently delete record" },
      { status: 500 }
    );
  }
}
