"use client"
import { InvoiceData } from '@/types/invoiceTypes';
import React, { useState } from 'react';

interface InvoiceDetailsPageProps {
    invoiceData: InvoiceData;
    updateInvoiceData: (data: Partial<InvoiceData>) => void;
    nextStep: () => void;
}

const InvoiceDetailsPage: React.FC<InvoiceDetailsPageProps> = ({
    invoiceData,
    updateInvoiceData,
    nextStep,
}) => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!invoiceData.invoice_date) newErrors.invoice_date = 'This field is required';
        if (!invoiceData.invoice_number) newErrors.invoice_number = 'This field is required';
        if (!invoiceData.buyer_name) newErrors.buyer_name = 'This field is required';
        if (!invoiceData.buyer_address) newErrors.buyer_address = 'This field is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (validateForm()) {
            nextStep();
        }
    };

    return (
        <div className="form-step">
            <p className="text-sm text-gray-500 mb-4">Step 1: Invoice Details</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Transaction Information</h2>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Transaction Type</label>
                        <div className="flex space-x-4">
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="retail"
                                    checked={invoiceData.type === 'retail'}
                                    onChange={() => updateInvoiceData({ type: 'retail' })}
                                /> Retail Sales
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="inter-city"
                                    checked={invoiceData.type === 'inter-city'}
                                    onChange={() => updateInvoiceData({ type: 'inter-city' })}
                                /> Inter-city Sales
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="purchase"
                                    checked={invoiceData.type === 'purchase'}
                                    onChange={() => updateInvoiceData({ type: 'purchase' })}
                                /> Purchase
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Input Mode</label>
                        <div className="flex space-x-4">
                            <label>
                                <input
                                    type="radio"
                                    name="mode"
                                    value="component"
                                    checked={invoiceData.mode === 'component'}
                                    onChange={() => updateInvoiceData({ mode: 'component' })}
                                /> Component Entry
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="mode"
                                    value="direct"
                                    checked={invoiceData.mode === 'direct'}
                                    onChange={() => updateInvoiceData({ mode: 'direct' })}
                                /> Direct Amount Entry
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="mode"
                                    value="reverse"
                                    checked={invoiceData.mode === 'reverse'}
                                    onChange={() => updateInvoiceData({ mode: 'reverse' })}
                                /> Reverse Calculation
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block">Invoice Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={invoiceData.invoice_date}
                                onChange={(e) => updateInvoiceData({ invoice_date: e.target.value })}
                                className={`w-full border rounded px-3 py-2 mt-1 ${errors.invoice_date ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.invoice_date && (
                                <div className="text-red-500 text-xs mt-1">{errors.invoice_date}</div>
                            )}
                        </div>
                        <div>
                            <label className="block">Invoice Number <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={invoiceData.invoice_number}
                                onChange={(e) => updateInvoiceData({ invoice_number: e.target.value })}
                                className={`w-full border rounded px-3 py-2 mt-1 ${errors.invoice_number ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.invoice_number && (
                                <div className="text-red-500 text-xs mt-1">{errors.invoice_number}</div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block">E-way Bill Number (Optional)</label>
                        <input
                            type="text"
                            value={invoiceData.eway_bill}
                            onChange={(e) => updateInvoiceData({ eway_bill: e.target.value })}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                    </div>

                    <h2 className="text-lg font-semibold mb-4">Buyer Information</h2>
                    <div className="mb-4">
                        <label className="block">Select Customer</label>
                        <select
                            value={invoiceData.customer_id}
                            onChange={(e) => updateInvoiceData({ customer_id: e.target.value })}
                            className="w-full border rounded px-3 py-2 mt-1"
                        >
                            <option value="">Select a customer</option>
                            <option value="1">Customer 1</option>
                            <option value="2">Customer 2</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block">Buyer Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={invoiceData.buyer_name}
                            onChange={(e) => updateInvoiceData({ buyer_name: e.target.value })}
                            className={`w-full border rounded px-3 py-2 mt-1 ${errors.buyer_name ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.buyer_name && (
                            <div className="text-red-500 text-xs mt-1">{errors.buyer_name}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block">Address <span className="text-red-500">*</span></label>
                        <textarea
                            value={invoiceData.buyer_address}
                            onChange={(e) => updateInvoiceData({ buyer_address: e.target.value })}
                            className={`w-full border rounded px-3 py-2 mt-1 ${errors.buyer_address ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.buyer_address && (
                            <div className="text-red-500 text-xs mt-1">{errors.buyer_address}</div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block">GSTIN</label>
                            <input
                                type="text"
                                value={invoiceData.buyer_gstin}
                                onChange={(e) => updateInvoiceData({ buyer_gstin: e.target.value })}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                        </div>
                        <div>
                            <label className="block">State & Code</label>
                            <select
                                value={invoiceData.buyer_state}
                                onChange={(e) => updateInvoiceData({
                                    buyer_state: e.target.value,
                                    buyer_state_code: e.target.value === 'UP' ? '09' : '27'
                                })}
                                className="w-full border rounded px-3 py-2 mt-1"
                            >
                                <option value="">Select State</option>
                                <option value="UP">Uttar Pradesh (09)</option>
                                <option value="MH">Maharashtra (27)</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-gray-100 text-gray-600 p-2 rounded text-sm mb-4">
                        Tax Type: CGST + SGST
                    </div>

                    <button
                        onClick={handleContinue}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        Continue to Line Items →
                    </button>
                </div>

                {/* Right Sidebar */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Information</h2>
                    <p className="text-sm mb-2">
                        <strong>J.V. JEWELLERS</strong><br />
                        SHOP NO. -2, KRISHNA HEIGHT, JAY SINGH PURA<br />
                        MATHURA<br />
                        GSTIN: 09ADCPV2673H1Z7<br />
                        State: Uttar Pradesh (09)
                    </p>

                    <h3 className="font-semibold mt-4 mb-2">Transaction Types</h3>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                        <li><span className="text-blue-500">Retail Sales:</span> CGST + SGST</li>
                        <li><span className="text-purple-500">Inter-city Sales:</span> IGST</li>
                        <li><span className="text-yellow-500">Purchase:</span> Inward procurement</li>
                    </ul>

                    <h3 className="font-semibold mt-4 mb-2">Input Modes</h3>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                        <li><span className="text-blue-500">Component Entry:</span> Auto-calculated</li>
                        <li><span className="text-gray-700">Direct Amount:</span> Enter total manually</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailsPage;