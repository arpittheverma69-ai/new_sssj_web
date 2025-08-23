import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch current invoice settings
export async function GET() {
    try {
        // Get the first (and should be only) invoice setting record
        const settings = await prisma.invoiceSetting.findFirst();

        if (!settings) {
            // Create default settings if none exist
            const defaultSettings = await prisma.invoiceSetting.create({
                data: {
                    invoice_prefix: 'JVJ/D/',
                    default_transaction_type: 'retail',
                    number_digits: 3,
                    default_input_mode: 'component',
                    starting_number: 1,
                    generate_original: true,
                    generate_duplicate: true,
                    generate_triplicate: true,
                },
            });
            return NextResponse.json(defaultSettings);
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching invoice settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoice settings' },
            { status: 500 }
        );
    }
}

// PUT - Update invoice settings
export async function PUT(request: Request) {
    try {
        const data = await request.json();

        // Get current settings to determine if we're updating or creating
        const currentSettings = await prisma.invoiceSetting.findFirst();

        if (!currentSettings) {
            return NextResponse.json(
                { error: 'No settings found to update' },
                { status: 404 }
            );
        }

        // Update existing settings
        const updatedSettings = await prisma.invoiceSetting.update({
            where: { id: currentSettings.id },
            data: {
                ...data,
                updated_at: new Date(),
            },
        });

        return NextResponse.json(updatedSettings);
    } catch (error) {
        console.error('Error updating invoice settings:', error);
        return NextResponse.json(
            { error: 'Failed to update invoice settings' },
            { status: 500 }
        );
    }
}