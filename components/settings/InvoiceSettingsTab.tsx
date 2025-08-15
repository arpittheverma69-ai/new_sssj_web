"use client"
import { useState } from 'react';

interface InvoiceSettings {
    invoicePrefix: string;
    defaultTransactionType: string;
    numberOfDigits: string;
    defaultInputMode: string;
    startingNumber: string;
    invoiceCopies: {
        original: boolean;
        duplicate: boolean;
        triplicate: boolean;
    };
}

const InvoiceSettingsTab = () => {
    const [settings, setSettings] = useState<InvoiceSettings>({
        invoicePrefix: 'JVJ/D/',
        defaultTransactionType: 'Retail Sales',
        numberOfDigits: '3 (001-999)',
        defaultInputMode: 'Component Entry',
        startingNumber: '020',
        invoiceCopies: {
            original: true,
            duplicate: true,
            triplicate: true,
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name.startsWith('invoiceCopies.')) {
            const copyType = name.split('.')[1] as keyof InvoiceSettings['invoiceCopies'];
            setSettings((prev) => ({
                ...prev,
                invoiceCopies: {
                    ...prev.invoiceCopies,
                    [copyType]: checked,
                },
            }));
        } else {
            setSettings((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Invoice settings submitted:', settings);
    };

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Invoice Settings</h2>

            <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                        <label className="block font-medium text-xs md:text-sm mb-1">
                            Invoice Prefix
                        </label>
                        <input
                            type="text"
                            name="invoicePrefix"
                            value={settings.invoicePrefix}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded mb-2 text-sm md:text-base"
                        />
                        <p className="text-xs md:text-sm text-gray-500">
                            Examples: JVJ/D/, INV-, BILL-
                        </p>
                    </div>

                    <div>
                        <label className="block font-medium text-xs md:text-sm mb-1">
                            Default Transaction Type
                        </label>
                        <select
                            name="defaultTransactionType"
                            value={settings.defaultTransactionType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        >
                            <option>Retail Sales</option>
                            <option>Wholesale</option>
                            <option>Export</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-xs md:text-sm mb-1">
                            Number of Digits
                        </label>
                        <select
                            name="numberOfDigits"
                            value={settings.numberOfDigits}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        >
                            <option>3 (001-999)</option>
                            <option>4 (0001-9999)</option>
                            <option>5 (00001-99999)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-xs md:text-sm mb-1">
                            Default Input Mode
                        </label>
                        <select
                            name="defaultInputMode"
                            value={settings.defaultInputMode}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        >
                            <option>Component Entry</option>
                            <option>Quick Entry</option>
                            <option>Barcode Scan</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-xs md:text-sm mb-1">
                            Starting Number
                        </label>
                        <input
                            type="text"
                            name="startingNumber"
                            value={settings.startingNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        />
                        <p className="text-xs md:text-sm text-gray-500">
                            Next invoice will be: {settings.invoicePrefix}
                            {settings.startingNumber}
                        </p>
                    </div>

                    <div>
                        <label className="block font-medium text-xs md:text-sm mb-1">
                            Invoice Copies
                        </label>
                        <div className="space-y-1 text-xs md:text-sm">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="invoiceCopies.original"
                                    checked={settings.invoiceCopies.original}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Original for Recipient
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="invoiceCopies.duplicate"
                                    checked={settings.invoiceCopies.duplicate}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Duplicate for Transporter
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="invoiceCopies.triplicate"
                                    checked={settings.invoiceCopies.triplicate}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Triplicate for Supplier
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded text-sm md:text-base"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceSettingsTab;