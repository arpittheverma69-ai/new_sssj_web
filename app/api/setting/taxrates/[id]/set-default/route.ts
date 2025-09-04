import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: "Invalid tax rate ID" },
                { status: 400 }
            );
        }

        // First, set all tax rates to not default
        await prisma.taxRate.updateMany({
            data: { is_default: false }
        });

        // Then set the selected one as default
        const updatedTaxRate = await prisma.taxRate.update({
            where: { id },
            data: { is_default: true }
        });

        return NextResponse.json({
            message: "Default tax rate updated successfully",
            taxRate: updatedTaxRate
        });
    } catch (error) {
        console.error("Error setting default tax rate:", error);
        return NextResponse.json(
            { error: "Failed to set default tax rate" },
            { status: 500 }
        );
    }
}
