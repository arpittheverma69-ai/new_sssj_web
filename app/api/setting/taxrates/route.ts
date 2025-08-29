
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET() {
    try {
        const taxRates = await prisma.taxRate.findMany({
            orderBy: { created_at: 'desc' },
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

        const taxRate = await prisma.taxRate.create({
            data: {
                hsn_code: data.hsn_code,
                description: data.description,
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