import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Generate next invoice number based on transaction type
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const transactionType = searchParams.get('type') || 'retail';

        // Get invoice settings
        const settings = await prisma.invoiceSetting.findFirst();
        
        if (!settings) {
            return NextResponse.json(
                { error: 'Invoice settings not found' },
                { status: 404 }
            );
        }

        // Get the appropriate prefix based on transaction type
        let prefix = '';
        let searchTransactionTypes = [transactionType];
        
        switch (transactionType) {
            case 'retail':
                prefix = settings.prefix_retail;
                break;
            case 'inter_state':
                prefix = settings.prefix_inter_city;
                // For inter_state and outer_state, use the same prefix and shared numbering
                if (settings.prefix_inter_city === settings.prefix_outer_state) {
                    searchTransactionTypes = ['inter_state', 'outer_state'];
                }
                break;
            case 'outer_state':
                prefix = settings.prefix_outer_state;
                // For inter_state and outer_state, use the same prefix and shared numbering
                if (settings.prefix_inter_city === settings.prefix_outer_state) {
                    searchTransactionTypes = ['inter_state', 'outer_state'];
                }
                break;
            default:
                prefix = settings.prefix_retail;
        }

        // Get the latest invoice number across shared transaction types to determine next sequence
        const latestInvoice = await prisma.invoice.findFirst({
            where: {
                transaction_type: {
                    in: searchTransactionTypes
                },
                invoice_number: {
                    startsWith: prefix
                }
            },
            orderBy: {
                created_at: 'desc'
            },
            select: {
                invoice_number: true
            }
        });

        let nextNumber = settings.starting_number;
        
        if (latestInvoice) {
            // Extract the number part from the latest invoice number
            const numberPart = latestInvoice.invoice_number.replace(prefix, '');
            const currentNumber = parseInt(numberPart) || 0;
            nextNumber = currentNumber + 1;
        }

        // Format the number with leading zeros based on number_digits setting
        const formattedNumber = nextNumber.toString().padStart(settings.number_digits, '0');
        const fullInvoiceNumber = `${prefix}${formattedNumber}`;

        return NextResponse.json({
            invoice_number: fullInvoiceNumber,
            prefix,
            sequence_number: nextNumber,
            transaction_type: transactionType
        });

    } catch (error) {
        console.error('Error generating next invoice number:', error);
        return NextResponse.json(
            { error: 'Failed to generate next invoice number' },
            { status: 500 }
        );
    }
}
