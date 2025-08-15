"use client"
import { useState } from 'react';
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
            <main className="flex-1 md:mt-0 transition-all duration-300">
                <header className="flex justify-between items-center mb-6 md:mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Settings</h2>
                        <p className="text-slate-500 text-sm md:text-base">Configure your shop profile, tax rates, and system preferences</p>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide space-x-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={` cursor-pointer tab-button px-4 py-2 rounded-md font-medium whitespace-nowrap cursor-po ${activeTab === tab.id
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