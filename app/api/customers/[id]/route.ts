import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    // The soft delete middleware will intercept this and update `deletedAt`
    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Customer soft-deleted successfully" });
  } catch (error) {
    console.error("Error soft-deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to soft-delete customer" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const data = await request.json();

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}
