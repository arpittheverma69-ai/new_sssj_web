"use client"
import React, { useState } from 'react';
import LineItemsTable from '../create-invoice/LineItemsTable';
import { LineItem } from '@/types/invoiceTypes';

interface LineItemsPageProps {
    lineItems: LineItem[];
    addLineItem: (item: Omit<LineItem, 'id' | 'taxableValue'>) => void;
    removeLineItem: (id: number) => void;
    invoiceData: any;
    nextStep: () => void;
    prevStep: () => void;
}

const LineItemsPage: React.FC<LineItemsPageProps> = ({
    lineItems,
    addLineItem,
    removeLineItem,
    nextStep,
    prevStep,
}) => {
    const [formData, setFormData] = useState({
        hsnSac: '7113 - Jewellery',
        description: 'SILVER ORNAMENTS',
        quantity: '0.000',
        unit: 'KGS',
        rate: '0.00',
    });
    const [cgstRate, setCgstRate] = useState('1.5');
    const [sgstRate, setSgstRate] = useState('1.5');

    const handleAddItem = () => {
        const quantity = parseFloat(formData.quantity) || 0;
        const rate = parseFloat(formData.rate) || 0;

        if (quantity <= 0 || rate <= 0) {
            alert('Please enter valid quantity and rate values.');
            return;
        }

        addLineItem({
            hsn_sac_code: formData.hsnSac.split(' - ')[0],
            description: formData.description,
            quantity,
            unit: formData.unit,
            rate,
        });

        // Reset form fields
        setFormData(prev => ({
            ...prev,
            quantity: '0.000',
            rate: '0.00',
        }));
    };

    const handleUseExample = () => {
        setFormData(prev => ({
            ...prev,
            quantity: '10.468',
            rate: '56000.08',
        }));
    };

    const handleContinue = () => {
        if (lineItems.length === 0) {
            alert('Please add at least one line item before continuing.');
            return;
        }
        nextStep();
    };

    return (
        <div className="form-step">
            <p className="text-sm text-gray-500 mb-4">Step 2: Add Line Items</p>

            {/* Add Line Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Add Line Items</h3>
                    <p className="text-sm text-gray-500 mt-2">Component Entry Mode</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mt-4">
                        <div className="xl:col-span-1">
                            <label htmlFor="hsn-sac" className="text-sm font-medium text-gray-600">
                                HSN/SAC Code
                            </label>
                            <select
                                id="hsn-sac"
                                value={formData.hsnSac}
                                onChange={(e) => setFormData({ ...formData, hsnSac: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option>7113 - Jewellery</option>
                                <option>7114 - Precious Stones</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 xl:col-span-1">
                            <label htmlFor="description" className="text-sm font-medium text-gray-600">
                                Description
                            </label>
                            <input
                                type="text"
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-600">
                                Quantity
                            </label>
                            <input
                                type="text"
                                id="quantity"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="unit" className="text-sm font-medium text-gray-600">
                                Unit
                            </label>
                            <select
                                id="unit"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option>KGS</option>
                                <option>GMS</option>
                                <option>PCS</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rate" className="text-sm font-medium text-gray-600">
                                Rate per KGS
                            </label>
                            <input
                                type="text"
                                id="rate"
                                value={formData.rate}
                                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex items-end xl:col-span-5">
                            <button
                                onClick={handleAddItem}
                                className="w-full xl:w-auto mt-4 xl:mt-0 ml-auto bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-600 flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Add Item
                            </button>
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-sm text-green-800">
                                Example: 10.468 KGS of Silver Ornaments at ₹56,000.08 per KG = ₹5,86,208.83 taxable value
                            </p>
                        </div>
                        <button
                            onClick={handleUseExample}
                            className="ml-4 text-sm font-semibold text-green-700 hover:text-green-800 whitespace-nowrap"
                        >
                            Use Example
                        </button>
                    </div>
                </div>
            </div>

            {/* Line Items Table */}
            <LineItemsTable lineItems={lineItems} onRemoveItem={removeLineItem} />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tax Configuration */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Tax Configuration</h3>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="cgst" className="text-sm font-medium text-gray-600">
                                CGST Rate (%)
                            </label>
                            <select
                                id="cgst"
                                value={cgstRate}
                                onChange={(e) => setCgstRate(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="1.5">1.5%</option>
                                <option value="2.5">2.5%</option>
                                <option value="6">6%</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="sgst" className="text-sm font-medium text-gray-600">
                                SGST Rate (%)
                            </label>
                            <select
                                id="sgst"
                                value={sgstRate}
                                onChange={(e) => setSgstRate(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="1.5">1.5%</option>
                                <option value="2.5">2.5%</option>
                                <option value="6">6%</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Invoice Summary */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Invoice Summary</h3>
                    <div className="mt-4 text-gray-700">
                        <div className="flex justify-between text-sm">
                            <span>Taxable Value:</span>
                            <span className="font-medium">
                                ₹{lineItems.reduce((sum, item) => sum + item.taxableValue, 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                            <span>SGST ({sgstRate}%):</span>
                            <span className="font-medium">
                                ₹{(lineItems.reduce((sum, item) => sum + item.taxableValue, 0) * (parseFloat(sgstRate) / 100)).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                            <span>CGST ({cgstRate}%):</span>
                            <span className="font-medium">
                                ₹{(lineItems.reduce((sum, item) => sum + item.taxableValue, 0) * (parseFloat(cgstRate) / 100)).toFixed(2)}
                            </span>
                        </div>
                        <div className="border-t border-gray-200 my-4"></div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Total Invoice Value:</span>
                            <span className="text-2xl font-bold">
                                ₹{(
                                    lineItems.reduce((sum, item) => sum + item.taxableValue, 0) *
                                    (1 + (parseFloat(cgstRate) + parseFloat(sgstRate)) / 100)
                                ).toFixed(2)}
                            </span>
                        </div>
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
                    Back to Invoice Details
                </button>
                <button
                    onClick={handleContinue}
                    className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-700 flex items-center justify-center"
                >
                    Continue to Review
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default LineItemsPage;