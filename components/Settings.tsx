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
        <div className='w-full flex flex-col mx-auto flex-1 p-3 sm:p-4 md:p-6 lg:p-8 max-sm:pt-26'>
            <main className="flex-1 md:mt-0 transition-all duration-300">
                <header className="mb-4 sm:mb-6 md:mb-8">
                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2">Settings</h2>
                        <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg hidden sm:block">Configure your shop profile, tax rates, and system preferences</p>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex overflow-x-auto pb-2 sm:pb-4 mb-3 sm:mb-4 md:mb-6 scrollbar-hide space-x-1 sm:space-x-2 md:space-x-3 -mx-3 px-3 sm:mx-0 sm:px-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 rounded-[20px] font-medium whitespace-nowrap transition-all duration-200 text-xs sm:text-sm md:text-base min-w-fit ${activeTab === tab.id
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
                <div className="bg-card rounded-[16px] sm:rounded-[20px] md:rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
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