
import { PrismaClient } from '@/lib/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()


export async function GET() {
    try {
        const taxRates = await prisma.taxRate.findMany({
            orderBy: { is_default: 'desc' },
        });
        return NextResponse.json(taxRates);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch tax rates' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // If this is set as default, unset any other defaults first
        if (data.is_default) {
            await prisma.taxRate.updateMany({
                where: { is_default: true },
                data: { is_default: false },
            });
        }

        const taxRate = await prisma.taxRate.create({
            data: {
                hsn_code: data.hsn_code,
                description: data.description,
                cgst_rate: data.cgst_rate,
                sgst_rate: data.sgst_rate,
                igst_rate: data.igst_rate,
                is_default: data.is_default,
            },
        });

        return NextResponse.json(taxRate);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create tax rate' },
            { status: 500 }
        );
    }
}


export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '0');

        await prisma.taxRate.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete tax rate' },
            { status: 500 }
        );
    }
}