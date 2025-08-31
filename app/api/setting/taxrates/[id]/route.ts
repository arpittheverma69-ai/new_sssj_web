import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 1. Get the ID from params
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid tax rate ID' },
                { status: 400 }
            );
        }

        // 2. Get the request body (no destructuring needed)
        const requestBody = await request.json();
        console.log("Updating tax rate ID:", id, "with data:", requestBody);

        // 3. Update the specific tax rate
        const taxRate = await prisma.taxRate.update({
            where: { id },
            data: {
                hsn_code: requestBody.hsn_code,
                description: requestBody.description,
            },
        });

        return NextResponse.json(taxRate);
    } catch (error) {
        console.error('Error updating tax rate:', error);
        return NextResponse.json(
            { error: 'Failed to update tax rate' },
            { status: 500 }
        );
    }
}