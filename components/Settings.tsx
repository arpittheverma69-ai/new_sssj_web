"use client"
import { useState } from 'react';
import Head from 'next/head';
import ShopProfileTab from './settings/ShopProfileTab';
import TaxRatesTab from './settings/TaxRatesTab';
import InvoiceSettingsTab from './settings/InvoiceSettingsTab';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('shopProfileTab');

    const tabs = [
        { id: 'shopProfileTab', label: 'Shop Profile' },
        { id: 'taxRatesTab', label: 'Tax Rates' },
        { id: 'invoiceSettingsTab', label: 'Invoice Settings' },
    ];

    return (
        <div className='w-full flex flex-col mx-auto flex-1 p-4 md:p-8'>
            <Head>
                <title>Settings</title>
                <meta name="description" content="Configure your shop settings" />
            </Head>

            <main className="flex-1 md:mt-0 transition-all duration-300">
                <div className="mb-4">
                    <h1 className="text-xl md:text-2xl font-semibold">Settings</h1>
                    <p className="text-xs md:text-sm text-gray-500">
                        Configure your shop profile, tax rates, and system preferences
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide space-x-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab-button px-4 py-2 rounded-md font-medium whitespace-nowrap cursor-po ${activeTab === tab.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:text-black'
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow">
                    {activeTab === 'shopProfileTab' && <ShopProfileTab />}
                    {activeTab === 'taxRatesTab' && <TaxRatesTab />}
                    {activeTab === 'invoiceSettingsTab' && <InvoiceSettingsTab />}
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;