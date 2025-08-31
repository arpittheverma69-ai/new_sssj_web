import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceData {
  id: number;
  invoice_number: string;
  invoice_date: string;
  buyer_name: string;
  buyer_address: string;
  buyer_gstin?: string;
  total_invoice_value: number;
  line_items: Array<{
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    taxable_value: number;
    taxes: Array<{
      tax_name: string;
      tax_rate: number;
      tax_amount: number;
    }>;
  }>;
}

export const generateInvoicePDF = (invoice: InvoiceData) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('J.V. JEWELLERS', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('GST INVOICE', 105, 30, { align: 'center' });

  // Invoice details
  doc.setFontSize(10);
  doc.text(`Invoice No: ${invoice.invoice_number}`, 20, 50);
  doc.text(`Date: ${new Date(invoice.invoice_date).toLocaleDateString()}`, 20, 60);

  // Buyer details
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.buyer_name, 20, 90);

  const addressLines = invoice.buyer_address.split('\n');
  let yPos = 100;
  addressLines.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 10;
  });

  if (invoice.buyer_gstin) {
    doc.text(`GSTIN: ${invoice.buyer_gstin}`, 20, yPos + 10);
  }

  // Line items table
  const tableData = invoice.line_items.map(item => [
    item.description,
    item.quantity.toString(),
    item.unit,
    `₹${item.rate.toFixed(2)}`,
    `₹${item.taxable_value.toFixed(2)}`,
    item.taxes.map(tax => `${tax.tax_name}: ₹${tax.tax_amount.toFixed(2)}`).join('\n')
  ]);

  autoTable(doc, {
    head: [['Description', 'Qty', 'Unit', 'Rate', 'Taxable Value', 'Taxes']],
    body: tableData,
    startY: yPos + 30,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 8 }
  });

  // Total
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Amount: ₹${invoice.total_invoice_value.toFixed(2)}`, 150, finalY, { align: 'right' });

  return doc;
};

export const downloadInvoicePDF = (invoice: InvoiceData) => {
  const doc = generateInvoicePDF(invoice);
  doc.save(`Invoice_${invoice.invoice_number}.pdf`);
};
