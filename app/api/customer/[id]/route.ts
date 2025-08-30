import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT - Update an existing customer
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const customerId = parseInt(params.id);
        const data = await request.json();

        // Validate required fields
        if (!data.name || !data.address || !data.city || !data.phone || !data.pan_number) {
            return NextResponse.json(
                { error: 'Name, address, city, phone, and PAN number are required fields' },
                { status: 400 }
            );
        }

        // Check if another customer with the same GSTIN exists
        if (data.gstin) {
            const existingCustomer = await prisma.customer.findFirst({
                where: {
                    gstin: data.gstin,
                    id: { not: customerId }
                }
            });

            if (existingCustomer) {
                return NextResponse.json(
                    { error: 'Another customer with this GSTIN already exists' },
                    { status: 400 }
                );
            }
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id: customerId },
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
            data: updatedCustomer
        });

    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json(
            { error: 'Failed to update customer' },
            { status: 500 }
        );
    }
}

// DELETE - Soft delete a customer
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const customerId = parseInt(params.id);

        await prisma.customer.update({
            where: { id: customerId },
            data: { deletedAt: new Date() }
        });

        return NextResponse.json({
            success: true,
            message: 'Customer deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting customer:', error);
        return NextResponse.json(
            { error: 'Failed to delete customer' },
            { status: 500 }
        );
    }
}
