import { PrismaClient } from '@/lib/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // 1. Get the ID from params
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid tax rate ID' },
                { status: 400 }
            );
        }

        // 2. Get the request body (no destructuring needed)
        const requestBody = await request.json();
        console.log("Updating tax rate ID:", id, "with data:", requestBody);

        // 3. If setting as default, unset other defaults
        if (requestBody.is_default) {
            await prisma.taxRate.updateMany({
                where: {
                    is_default: true,
                    id: { not: id },
                },
                data: { is_default: false },
            });
        }

        // 4. Update the specific tax rate
        const taxRate = await prisma.taxRate.update({
            where: { id },
            data: requestBody, // Directly use requestBody
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