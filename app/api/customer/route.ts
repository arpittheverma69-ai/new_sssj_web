import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST - Create a new customer
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        // Validate required fields
        if (!data.name || !data.address || !data.city || !data.phone || !data.pan_number) {
            return NextResponse.json(
                { error: 'Name, address, city, and phone are required fields' },
                { status: 400 }
            )
        }

        // Check if customer with same GSTIN already exists (if provided)
        if (data.gstin) {
            const existingCustomer = await prisma.customer.findUnique({
                where: { gstin: data.gstin }
            });

            if (existingCustomer) {
                return NextResponse.json(
                    { error: 'Customer with this GSTIN already exists' },
                    { status: 400 }
                );
            }
        }

        // Create the customer
        const customer = await prisma.customer.create({
            data: {
                name: data.name,
                address: data.address,
                city: data.city,
                state_id: data.state_id ? parseInt(data.state_id) : null,
                pincode: data.pincode || null,
                gstin: data.gstin || null,
                phone: data.phone,
                pan_number: data.pan_number,
                email: data.email || null,
            },
            include: { state: true }
        });

        return NextResponse.json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error('Error creating customer:', error);
        return NextResponse.json(
            { error: 'Failed to create customer' },
            { status: 500 }
        );
    }
}

// GET - Fetch all customers
export async function GET() {
    try {
        const customers = await prisma.customer.findMany({
            include: { state: true },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch customers' },
            { status: 500 }
        );
    }
}