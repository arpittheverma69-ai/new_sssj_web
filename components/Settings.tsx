"use client"
import { useState } from 'react';
import ShopProfileTab from './settings/ShopProfileTab';
import TaxRatesTab from './settings/TaxRatesTab';
import InvoiceSettingsTab from './settings/InvoiceSettingsTab';
import UserManagementTab from './settings/UserManagementTab';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('shopProfileTab');

    const tabs = [
        { id: 'shopProfileTab', label: 'Shop Profile' },
        { id: 'taxRatesTab', label: 'Tax Rates' },
        { id: 'invoiceSettingsTab', label: 'Invoice Settings' },
        { id: 'userManagementTab', label: 'User Management' },
    ];

    return (
        <div className='w-full flex flex-col mx-auto flex-1 p-6 md:p-8'>
            <main className="flex-1 md:mt-0 transition-all duration-300">
                <header className="mb-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Settings</h2>
                        <p className="text-muted-foreground text-base md:text-lg">Configure your shop profile, tax rates, and system preferences</p>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide space-x-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`px-6 py-3 rounded-[20px] font-medium whitespace-nowrap transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                    {activeTab === 'shopProfileTab' && <ShopProfileTab />}
                    {activeTab === 'taxRatesTab' && <TaxRatesTab />}
                    {activeTab === 'invoiceSettingsTab' && <InvoiceSettingsTab />}
                    {activeTab === 'userManagementTab' && <UserManagementTab />}
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;