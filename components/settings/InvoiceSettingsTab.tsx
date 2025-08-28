"use client"
import { useState, useEffect } from 'react';
import { showToast, apiToast } from '@/utils/toast';

type TransactionType = 'retail' | 'inter_state' | 'purchase';
type InputMode = 'component' | 'direct' | 'reverse';

interface InvoiceSettings {
    id?: number;
    invoice_prefix: string;
    prefix_retail?: string;
    prefix_inter_city?: string;
    prefix_outer_state?: string;
    default_transaction_type: TransactionType;
    number_digits: number;
    default_input_mode: InputMode;
    starting_number: number;
    generate_original: boolean;
    generate_duplicate: boolean;
    generate_triplicate: boolean;
}

const InvoiceSettingsTab = () => {
    const [settings, setSettings] = useState<InvoiceSettings>({
        invoice_prefix: 'JVJ/D/',
        prefix_retail: 'JVJ/D/',
        prefix_inter_city: 'JVJ/D/',
        prefix_outer_state: 'JVJ/S/',
        default_transaction_type: 'retail',
        number_digits: 3,
        default_input_mode: 'component',
        starting_number: 1,
        generate_original: true,
        generate_duplicate: true,
        generate_triplicate: true,
    });

    // Fetch settings from API on component mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                await apiToast.call(
                    async () => {
                        const response = await fetch('/api/setting/invoicesetting');
                        if (!response.ok) {
                            throw new Error('Failed to fetch settings');
                        }
                        const data = await response.json();
                        setSettings(data);
                        return data;
                    },
                    {
                        loading: 'Loading invoice settings...',
                        success: 'Settings loaded successfully',
                        error: 'Failed to load invoice settings'
                    }
                );
            } catch (error) {
                console.error('Failed to fetch invoice settings:', error);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked :
                ['number_digits', 'starting_number'].includes(name) ?
                    parseInt(value) || 0 :
                    value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await apiToast.call(
                async () => {
                    const response = await fetch('/api/setting/invoicesetting', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(settings),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.details || errorData.error || 'Failed to save settings');
                    }

                    const updatedSettings = await response.json();
                    setSettings(updatedSettings);
                    return updatedSettings;
                },
                {
                    loading: 'Saving invoice settings...',
                    success: 'Settings saved successfully!',
                    error: 'Failed to save settings'
                }
            );
        } catch (error) {
            console.error('Error saving settings:', error);
        }
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
                            name="invoice_prefix"
                            value={settings.invoice_prefix}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded mb-2 text-sm md:text-base"
                        />
                        <p className="text-xs md:text-sm text-gray-500">
                            Examples: JVJ/D/, INV-, BILL-
                        </p>
                    </div>

                    <div>
                        <label className="block font-medium text-xs md:text-sm mb-1">
                            Retail Sales Prefix
                        </label>
                        <input
                            type="text"
                            name="prefix_retail"
                            value={settings.prefix_retail || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded mb-2 text-sm md:text-base"
                        />
                        <p className="text-xs md:text-sm text-gray-500">Default: JVJ/D/</p>
                    </div>

                    <div>
                        <label className="block font-medium text-xs md:text-sm mb-1">
                            Inter-state Sales Prefix
                        </label>
                        <input
                            type="text"
                            name="prefix_inter_city"
                            value={settings.prefix_inter_city || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded mb-2 text-sm md:text-base"
                        />
                        <p className="text-xs md:text-sm text-gray-500">Default: JVJ/D/</p>
                    </div>

                    <div>
                        <label className="block font-medium text-xs md:text-sm mb-1">
                            Outer-state Sales Prefix
                        </label>
                        <input
                            type="text"
                            name="prefix_outer_state"
                            value={settings.prefix_outer_state || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded mb-2 text-sm md:text-base"
                        />
                        <p className="text-xs md:text-sm text-gray-500">Default: JVJ/S/</p>
                    </div>

                    <div>
                        <label className="block font-medium text-xs md:text-sm mb-1">
                            Default Transaction Type
                        </label>
                        <select
                            name="default_transaction_type"
                            value={settings.default_transaction_type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        >
                            <option value="retail">Retail Sales</option>
                            <option value="inter_state">Inter State</option>
                            <option value="purchase">Purchase</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-xs md:text-sm mb-1">
                            Number of Digits
                        </label>
                        <select
                            name="number_digits"
                            value={settings.number_digits}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        >
                            <option value={3}>3 (001-999)</option>
                            <option value={4}>4 (0001-9999)</option>
                            <option value={5}>5 (00001-99999)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-xs md:text-sm mb-1">
                            Default Input Mode
                        </label>
                        <select
                            name="default_input_mode"
                            value={settings.default_input_mode}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        >
                            <option value="component">Component Entry</option>
                            <option value="direct">Direct Entry</option>
                            <option value="reverse">Reverse Entry</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-xs md:text-sm mb-1">
                            Starting Number
                        </label>
                        <input
                            type="number"
                            name="starting_number"
                            value={settings.starting_number}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                            min="1"
                        />
                        <p className="text-xs md:text-sm text-gray-500">
                            Next invoice will be: {settings.invoice_prefix}
                            {settings.starting_number.toString().padStart(settings.number_digits, '0')}
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
                                    name="generate_original"
                                    checked={settings.generate_original}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Original for Recipient
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="generate_duplicate"
                                    checked={settings.generate_duplicate}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Duplicate for Transporter
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="generate_triplicate"
                                    checked={settings.generate_triplicate}
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