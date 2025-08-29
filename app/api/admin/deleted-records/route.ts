import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { softDeleteUtils } from "@/lib/softDelete";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const model = searchParams.get('model');

    if (!model) {
      return NextResponse.json({ error: "Model parameter is required" }, { status: 400 });
    }

    let deletedRecords;

    switch (model.toLowerCase()) {
      case 'customer':
        deletedRecords = await softDeleteUtils.findDeleted(prisma.customer, {
          include: { state: true },
          orderBy: { deletedAt: 'desc' },
        });
        break;
      case 'invoice':
        deletedRecords = await softDeleteUtils.findDeleted(prisma.invoice, {
          include: { customer: true },
          orderBy: { deletedAt: 'desc' },
        });
        break;
      case 'user':
        deletedRecords = await softDeleteUtils.findDeleted(prisma.user, {
          orderBy: { deletedAt: 'desc' },
        });
        break;
      case 'taxrate':
        deletedRecords = await softDeleteUtils.findDeleted(prisma.taxRate, {
          orderBy: { deletedAt: 'desc' },
        });
        break;
      default:
        return NextResponse.json({ error: "Invalid model specified" }, { status: 400 });
    }

    return NextResponse.json({
      model,
      deletedRecords,
      count: deletedRecords.length,
    });
  } catch (error) {
    console.error("Error fetching deleted records:", error);
    return NextResponse.json(
      { error: "Failed to fetch deleted records" },
      { status: 500 }
    );
  }
}
