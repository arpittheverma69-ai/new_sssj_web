import { NextRequest, NextResponse } from 'next/server';
import { generateInvoiceHTML } from '@/utils/invoicePdfGenerator';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { invoiceData, lineItems, cgstRate, sgstRate } = data;

    // Generate HTML content
    const htmlContent = generateInvoiceHTML({
      invoiceData,
      lineItems,
      cgstRate,
      sgstRate
    });

    // Return HTML content for client-side PDF generation
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="Invoice_${invoiceData.invoice_number}.html"`
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
