import { LineItem } from '@/types/invoiceTypes';
import React from 'react';

interface LineItemsTableProps {
    lineItems: LineItem[];
    onRemoveItem: (id: number) => void;
}

const LineItemsTable: React.FC<LineItemsTableProps> = ({ lineItems, onRemoveItem }) => {
    return (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">HSN/SAC</th>
                            <th scope="col" className="px-6 py-3">Description</th>
                            <th scope="col" className="px-6 py-3">Quantity</th>
                            <th scope="col" className="px-6 py-3">Rate</th>
                            <th scope="col" className="px-6 py-3">Taxable Value</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lineItems.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 px-6 text-gray-500">
                                    No items added yet
                                </td>
                            </tr>
                        ) : (
                            lineItems.map((item) => (
                                <tr key={item.id} className="bg-white border-b">
                                    <td className="px-6 py-4">{item.hsn_sac_code}</td>
                                    <td className="px-6 py-4">{item.description}</td>
                                    <td className="px-6 py-4">
                                        {item.quantity.toFixed(3)} {item.unit}
                                    </td>
                                    <td className="px-6 py-4">₹{item.rate.toFixed(2)}</td>
                                    <td className="px-6 py-4">₹{item.taxableValue.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => onRemoveItem(item.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LineItemsTable;