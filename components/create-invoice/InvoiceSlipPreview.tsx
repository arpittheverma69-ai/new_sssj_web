import { LineItem } from '@/types/invoiceTypes';
import { numberToWords } from '@/utils/numberToWords';
import React from 'react';

interface InvoiceSlipPreviewProps {
    invoiceData: any;
    lineItems: LineItem[];
    cgstRate: number;
    sgstRate: number;
    globalRoundoff: number;
}

const InvoiceSlipPreview: React.FC<InvoiceSlipPreviewProps> = ({
    invoiceData,
    lineItems,
    cgstRate,
    sgstRate,
    globalRoundoff,
}) => {
    // ✅ Helper for currency formatting
    const formatCurrency = (amount: number) =>
        Number(amount || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    // ✅ Ensure all numeric values are properly casted
    const taxableValue = lineItems.reduce((sum, item) => sum + Number(item.taxableValue || 0), 0);
    const cgstAmount = taxableValue * (Number(cgstRate) / 100);
    const sgstAmount = taxableValue * (Number(sgstRate) / 100);
    const totalBeforeRoundoff = taxableValue + cgstAmount + sgstAmount;
    const totalInvoice = totalBeforeRoundoff + Number(globalRoundoff || 0);
    const totalQuantity = lineItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const unit = lineItems.length > 0 ? lineItems[0].unit : 'KGS';

    // Format date as DD-MMM-YY
    const invoiceDate = new Date(invoiceData.invoice_date);
    const formattedDate = invoiceDate
        .toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
        })
        .replace(',', '');

    // Extract city from address (safer fallback)
    const addressParts = invoiceData.buyer_address?.split(',') || [];
    const city =
        addressParts.length > 1
            ? addressParts[addressParts.length - 2]?.trim()
            : invoiceData.buyer_city || 'N/A';

    return (
        <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4 text-foreground">Invoice Preview</h3>

            <div
                id="invoice-slip-container"
                className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800 overflow-x-auto overflow-y-auto max-h-screen"
            >
                <div
                    id="invoice-content"
                    className="bg-white dark:bg-gray-900 text-black dark:text-white mx-auto p-8 shadow-lg rounded-lg"
                    style={{ 
                        width: '210mm', 
                        minWidth: '210mm',
                        minHeight: '297mm'
                    }}
                >
                    {/* Header Section */}
                    <div className="border-b-2 border-black pb-4 mb-6">
                        <div className="text-center mb-4">
                            <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-400">
                                JEWELLERS INVOICE
                            </h1>
                            <p className="text-lg font-semibold">TAX INVOICE</p>
                            <p className="text-sm italic">(ORIGINAL FOR RECIPIENT)</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold text-sm mb-2">SELLER DETAILS:</h3>
                                <div className="text-sm space-y-1">
                                    <p className="font-semibold">Your Jewellery Store</p>
                                    <p>123 Main Street, Jewellery Market</p>
                                    <p>City, State - 123456</p>
                                    <p>GSTIN: 12ABCDE3456F7GH</p>
                                    <p>Phone: +91 98765 43210</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-sm mb-2">BUYER DETAILS:</h3>
                                <div className="text-sm space-y-1">
                                    <p className="font-semibold">{invoiceData.buyer_name}</p>
                                    <p>{invoiceData.buyer_address}</p>
                                    <p>GSTIN: {invoiceData.buyer_gstin || 'N/A'}</p>
                                    <p>State: {invoiceData.buyer_state}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                            <div>
                                <span className="font-semibold text-sm">Invoice No: </span>
                                <span className="text-sm">{invoiceData.invoice_number}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-sm">Date: </span>
                                <span className="text-sm">{formattedDate}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-sm">E-Way Bill: </span>
                                <span className="text-sm">{invoiceData.eway_bill || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="mb-6">
                        <table className="w-full border-collapse border border-black text-sm">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="border border-black p-2 text-left font-bold">S.No</th>
                                    <th className="border border-black p-2 text-left font-bold">Description</th>
                                    <th className="border border-black p-2 text-center font-bold">HSN/SAC</th>
                                    <th className="border border-black p-2 text-center font-bold">Qty</th>
                                    <th className="border border-black p-2 text-center font-bold">Unit</th>
                                    <th className="border border-black p-2 text-right font-bold">Rate (₹)</th>
                                    <th className="border border-black p-2 text-right font-bold">Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lineItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="border border-black p-2 text-center">{index + 1}</td>
                                        <td className="border border-black p-2">{item.description}</td>
                                        <td className="border border-black p-2 text-center">{item.hsn_sac_code}</td>
                                        <td className="border border-black p-2 text-center font-bold">
                                            {Number(item.quantity).toFixed(item.unit === 'PCS' ? 0 : 3)}
                                        </td>
                                        <td className="border border-black p-2 text-center">{item.unit}</td>
                                        <td className="border border-black p-2 text-right">
                                            {formatCurrency(Number(item.rate))}
                                        </td>
                                        <td className="border border-black p-2 text-right font-bold">
                                            {formatCurrency(Number(item.taxableValue))}
                                        </td>
                                    </tr>
                                ))}

                                {/* Summary Rows */}
                                <tr>
                                    <td colSpan={6} className="border border-black p-2 text-right font-bold">
                                        Sub Total:
                                    </td>
                                    <td className="border border-black p-2 text-right font-bold">
                                        ₹{formatCurrency(taxableValue)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={6} className="border border-black p-2 text-right">
                                        CGST ({cgstRate}%):
                                    </td>
                                    <td className="border border-black p-2 text-right">
                                        ₹{formatCurrency(cgstAmount)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={6} className="border border-black p-2 text-right">
                                        SGST ({sgstRate}%):
                                    </td>
                                    <td className="border border-black p-2 text-right">
                                        ₹{formatCurrency(sgstAmount)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={6} className="border border-black p-2 text-right">
                                        Round Off:
                                    </td>
                                    <td className="border border-black p-2 text-right">
                                        ₹{formatCurrency(Number(globalRoundoff || 0))}
                                    </td>
                                </tr>
                                <tr className="bg-yellow-100 dark:bg-yellow-900">
                                    <td
                                        colSpan={6}
                                        className="border border-black p-2 text-right font-bold text-lg"
                                    >
                                        TOTAL AMOUNT:
                                    </td>
                                    <td className="border border-black p-2 text-right font-bold text-lg">
                                        ₹{Math.round(totalInvoice)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Amount in Words */}
                    <div className="mb-6 p-4 border border-black">
                        <p className="font-bold text-sm mb-2">Amount in Words:</p>
                        <p className="text-sm italic">
                            {numberToWords(Math.round(totalInvoice))} Rupees Only
                        </p>
                    </div>

                    {/* Terms and Signature */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-sm mb-2">Terms & Conditions:</h4>
                            <ul className="text-xs space-y-1">
                                <li>• Goods once sold will not be taken back</li>
                                <li>• All disputes subject to local jurisdiction</li>
                                <li>• Payment due within 30 days</li>
                                <li>• Interest @ 18% p.a. on delayed payments</li>
                            </ul>
                        </div>

                        <div className="text-right">
                            <div className="mb-16">
                                <p className="font-bold text-sm">For Your Jewellery Store</p>
                            </div>
                            <div className="border-t border-black pt-2">
                                <p className="text-sm">Authorized Signatory</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceSlipPreview;
