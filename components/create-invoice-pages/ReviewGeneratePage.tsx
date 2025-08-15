"use client"
import React, { useState } from 'react';
import InvoiceSlipPreview from '../create-invoice/InvoiceSlipPreview';
import { LineItem } from '@/types/invoiceTypes';

interface ReviewGeneratePageProps {
    invoiceData: any;
    lineItems: LineItem[];
    prevStep: () => void;
}

const ReviewGeneratePage: React.FC<ReviewGeneratePageProps> = ({
    invoiceData,
    lineItems,
    prevStep,
}) => {
    const [cgstRate] = useState('1.5');
    const [sgstRate] = useState('1.5');
    const [selectedCopies, setSelectedCopies] = useState({
        originalCopy: true,
        duplicateCopy: true,
        triplicateCopy: true,
    });

    const taxableValue = lineItems.reduce((sum, item) => sum + item.taxableValue, 0);
    const cgstAmount = taxableValue * (parseFloat(cgstRate) / 100);
    const sgstAmount = taxableValue * (parseFloat(sgstRate) / 100);
    const totalInvoice = taxableValue + cgstAmount + sgstAmount;

    const handleCopyChange = (copy: keyof typeof selectedCopies) => {
        setSelectedCopies(prev => ({
            ...prev,
            [copy]: !prev[copy],
        }));
    };

    const handleGeneratePDF = () => {
        // PDF generation logic would go here
        alert('PDF generation would be implemented here');
    };

    const handleSubmitInvoice = () => {
        // Invoice submission logic would go here
        alert('Invoice submission would be implemented here');
    };

    return (
        <div className="form-step">
            <p className="text-sm text-gray-500 mb-4">Step 3: Review & Generate Invoice</p>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6">Invoice Review</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 className="text-lg font-medium mb-2">Invoice Details</h3>
                        <div className="space-y-2">
                            <p>
                                <strong>Invoice Number:</strong> {invoiceData.invoice_number}
                            </p>
                            <p>
                                <strong>Invoice Date:</strong>{' '}
                                {new Date(invoiceData.invoice_date).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Transaction Type:</strong>{' '}
                                {invoiceData.type === 'retail'
                                    ? 'Retail Sales'
                                    : invoiceData.type === 'inter-city'
                                        ? 'Inter-city Sales'
                                        : 'Purchase'}
                            </p>
                            <p>
                                <strong>Buyer Name:</strong> {invoiceData.buyer_name}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium mb-2">Tax Summary</h3>
                        <div className="space-y-1">
                            <div className="flex justify-between py-1">
                                <span>Taxable Value:</span>
                                <span>₹{taxableValue.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>CGST ({cgstRate}%):</span>
                                <span>₹{cgstAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>SGST ({sgstRate}%):</span>
                                <span>₹{sgstAmount.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 my-2"></div>
                            <div className="flex justify-between font-semibold py-1">
                                <span>Total Invoice Value:</span>
                                <span>₹{totalInvoice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="text-lg font-medium mb-2">Line Items</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-2 py-3">HSN/SAC</th>
                                <th className="px-2 py-3">Description</th>
                                <th className="px-2 py-3 text-right">Quantity</th>
                                <th className="px-2 py-3 text-right">Rate</th>
                                <th className="px-2 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineItems.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="py-2">{item.hsn_sac_code}</td>
                                    <td className="py-2">{item.description}</td>
                                    <td className="py-2 text-right">
                                        {item.quantity.toFixed(3)} {item.unit}
                                    </td>
                                    <td className="py-2 text-right">₹{item.rate.toFixed(2)}</td>
                                    <td className="py-2 text-right">₹{item.taxableValue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Invoice Slip Preview */}
                <InvoiceSlipPreview
                    invoiceData={invoiceData}
                    lineItems={lineItems}
                    cgstRate={parseFloat(cgstRate)}
                    sgstRate={parseFloat(sgstRate)}
                />

                {/* Generation Options */}
                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-2">Generation Options</h3>

                    <div className="mb-4">
                        <label className="block font-medium mb-2">Invoice Copies</label>
                        <div className="flex flex-wrap gap-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedCopies.originalCopy}
                                    onChange={() => handleCopyChange('originalCopy')}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="ml-2">Original for Recipient</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedCopies.duplicateCopy}
                                    onChange={() => handleCopyChange('duplicateCopy')}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="ml-2">Duplicate for Transporter</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedCopies.triplicateCopy}
                                    onChange={() => handleCopyChange('triplicateCopy')}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="ml-2">Triplicate for Supplier</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between items-center">
                    <button
                        onClick={prevStep}
                        className="mt-4 sm:mt-0 font-semibold text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-100 flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Line Items
                    </button>
                    <div>
                        <button
                            onClick={handleGeneratePDF}
                            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-blue-700 flex items-center justify-center mr-4"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Generate PDF
                        </button>
                        <button
                            onClick={handleSubmitInvoice}
                            className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-green-700 flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Submit Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewGeneratePage;