"use client"
import { InvoiceData } from '@/types/invoiceTypes';
import React, { useState } from 'react';
import { Calendar, Hash, Truck, User, MapPin, Building2, CreditCard, Calculator, ArrowRight } from 'lucide-react';

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
        if (!invoiceData.invoice_date) newErrors.invoice_date = 'Invoice date is required';
        if (!invoiceData.invoice_number) newErrors.invoice_number = 'Invoice number is required';
        if (!invoiceData.buyer_name) newErrors.buyer_name = 'Buyer name is required';
        if (!invoiceData.buyer_address) newErrors.buyer_address = 'Buyer address is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (validateForm()) {
            nextStep();
        }
    };

    const transactionTypes = [
        { value: 'retail', label: 'Retail Sales', description: 'Local sales with CGST + SGST', icon: '🏪', color: 'bg-blue-500' },
        { value: 'inter-city', label: 'Inter-city Sales', description: 'Out-of-state sales with IGST', icon: '🚚', color: 'bg-purple-500' },
        { value: 'purchase', label: 'Purchase', description: 'Inward procurement', icon: '📦', color: 'bg-green-500' }
    ];

    const inputModes = [
        { value: 'component', label: 'Component Entry', description: 'Auto-calculated tax breakdown', icon: '🧮', color: 'bg-indigo-500' },
        { value: 'direct', label: 'Direct Amount Entry', description: 'Enter total amount manually', icon: '💰', color: 'bg-yellow-500' },
        { value: 'reverse', label: 'Reverse Calculation', description: 'Calculate from final amount', icon: '🔄', color: 'bg-orange-500' }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-[20px] flex items-center justify-center text-white">
                        <Hash className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Create New Invoice</h1>
                        <p className="text-muted-foreground">Step 1: Invoice Details</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Form Section */}
                <div className="xl:col-span-3 space-y-8">
                    {/* Transaction Information Card */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary rounded-[20px] flex items-center justify-center text-white">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Transaction Information</h2>
                                    <p className="text-muted-foreground">Configure the type and mode of your transaction</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Transaction Type */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-4">Transaction Type</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {transactionTypes.map((type) => (
                                        <label
                                            key={type.value}
                                            className={`relative cursor-pointer group transition-all duration-200 ${
                                                invoiceData.type === type.value
                                                    ? 'scale-105'
                                                    : 'hover:scale-105'
                                            }`}
                                        >
                                <input
                                    type="radio"
                                    name="type"
                                                value={type.value}
                                                checked={invoiceData.type === type.value}
                                                onChange={() => updateInvoiceData({ type: type.value as any })}
                                                className="sr-only"
                                            />
                                            <div className={`p-4 rounded-[20px] border-2 transition-all duration-200 ${
                                                invoiceData.type === type.value
                                                    ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25'
                                                    : 'border-border hover:border-blue-300 bg-card'
                                            }`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 ${type.color} rounded-[16px] flex items-center justify-center text-white text-lg`}>
                                                        {type.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-foreground">{type.label}</div>
                                                        <div className="text-xs text-muted-foreground">{type.description}</div>
                                                    </div>
                                                </div>
                                            </div>
                            </label>
                                    ))}
                        </div>
                    </div>

                            {/* Input Mode */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-4">Input Mode</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {inputModes.map((mode) => (
                                        <label
                                            key={mode.value}
                                            className={`relative cursor-pointer group transition-all duration-200 ${
                                                invoiceData.mode === mode.value
                                                    ? 'scale-105'
                                                    : 'hover:scale-105'
                                            }`}
                                        >
                                <input
                                    type="radio"
                                    name="mode"
                                                value={mode.value}
                                                checked={invoiceData.mode === mode.value}
                                                onChange={() => updateInvoiceData({ mode: mode.value as any })}
                                                className="sr-only"
                                            />
                                            <div className={`p-4 rounded-[20px] border-2 transition-all duration-200 ${
                                                invoiceData.mode === mode.value
                                                    ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25'
                                                    : 'border-border hover:border-blue-300 bg-card'
                                            }`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 ${mode.color} rounded-[16px] flex items-center justify-center text-white text-lg`}>
                                                        {mode.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-foreground">{mode.label}</div>
                                                        <div className="text-xs text-muted-foreground">{mode.description}</div>
                                                    </div>
                                                </div>
                                            </div>
                            </label>
                                    ))}
                        </div>
                    </div>

                            {/* Invoice Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Invoice Date <span className="text-destructive">*</span>
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="date"
                                value={invoiceData.invoice_date}
                                onChange={(e) => updateInvoiceData({ invoice_date: e.target.value })}
                                            className={`w-full pl-10 pr-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 ${
                                                errors.invoice_date ? 'border-destructive' : 'hover:border-primary/50'
                                            }`}
                                required
                            />
                                    </div>
                            {errors.invoice_date && (
                                        <div className="text-destructive text-xs mt-2 flex items-center gap-1">
                                            <span>⚠</span> {errors.invoice_date}
                                        </div>
                            )}
                        </div>

                        <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Invoice Number <span className="text-destructive">*</span>
                                    </label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={invoiceData.invoice_number}
                                onChange={(e) => updateInvoiceData({ invoice_number: e.target.value })}
                                            className={`w-full pl-10 pr-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 ${
                                                errors.invoice_number ? 'border-destructive' : 'hover:border-primary/50'
                                            }`}
                                            placeholder="JVJ/021"
                                required
                            />
                                    </div>
                            {errors.invoice_number && (
                                        <div className="text-destructive text-xs mt-2 flex items-center gap-1">
                                            <span>⚠</span> {errors.invoice_number}
                                        </div>
                            )}
                        </div>
                    </div>

                            {/* E-way Bill */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    E-way Bill Number <span className="text-muted-foreground text-xs">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={invoiceData.eway_bill}
                            onChange={(e) => updateInvoiceData({ eway_bill: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                                        placeholder="Enter e-way bill number"
                        />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buyer Information Card */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 p-6 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-[20px] flex items-center justify-center text-white">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Buyer Information</h2>
                                    <p className="text-muted-foreground">Enter customer details and billing information</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Customer Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Select Customer</label>
                        <select
                            value={invoiceData.customer_id}
                            onChange={(e) => updateInvoiceData({ customer_id: e.target.value })}
                                    className="w-full px-4 py-3 border border-border rounded-[20px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                                >
                                    <option value="">Select a customer from your database</option>
                                    <option value="1">John Doe - Customer 1</option>
                                    <option value="2">Jane Smith - Customer 2</option>
                        </select>
                    </div>

                            {/* Buyer Name */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Buyer Name <span className="text-destructive">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={invoiceData.buyer_name}
                            onChange={(e) => updateInvoiceData({ buyer_name: e.target.value })}
                                        className={`w-full pl-10 pr-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 ${
                                            errors.buyer_name ? 'border-destructive' : 'hover:border-primary/50'
                                        }`}
                                        placeholder="Enter buyer's full name"
                            required
                        />
                                </div>
                        {errors.buyer_name && (
                                    <div className="text-destructive text-xs mt-2 flex items-center gap-1">
                                        <span>⚠</span> {errors.buyer_name}
                                    </div>
                        )}
                    </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Address <span className="text-destructive">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <textarea
                            value={invoiceData.buyer_address}
                            onChange={(e) => updateInvoiceData({ buyer_address: e.target.value })}
                                        className={`w-full pl-10 pr-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 resize-none ${
                                            errors.buyer_address ? 'border-destructive' : 'hover:border-primary/50'
                                        }`}
                                        placeholder="Enter complete billing address"
                                        rows={3}
                            required
                        />
                                </div>
                        {errors.buyer_address && (
                                    <div className="text-destructive text-xs mt-2 flex items-center gap-1">
                                        <span>⚠</span> {errors.buyer_address}
                                    </div>
                        )}
                    </div>

                            {/* GSTIN and State */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">GSTIN</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={invoiceData.buyer_gstin}
                                onChange={(e) => updateInvoiceData({ buyer_gstin: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                                            placeholder="22AAAAA0000A1Z5"
                            />
                        </div>
                                </div>

                        <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">State & Code</label>
                            <select
                                value={invoiceData.buyer_state}
                                onChange={(e) => updateInvoiceData({
                                    buyer_state: e.target.value,
                                    buyer_state_code: e.target.value === 'UP' ? '09' : '27'
                                })}
                                        className="w-full px-4 py-3 border border-border rounded-[20px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                            >
                                <option value="">Select State</option>
                                <option value="UP">Uttar Pradesh (09)</option>
                                <option value="MH">Maharashtra (27)</option>
                                        <option value="DL">Delhi (07)</option>
                                        <option value="KA">Karnataka (29)</option>
                                        <option value="TN">Tamil Nadu (33)</option>
                            </select>
                        </div>
                    </div>

                            {/* Tax Type Display */}
                            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-[20px] border border-blue-500/20">
                                <div className="flex items-center gap-3">
                                    <Calculator className="w-5 h-5 text-blue-500" />
                                    <div>
                                        <div className="font-semibold text-foreground">Tax Type: CGST + SGST</div>
                                        <div className="text-sm text-muted-foreground">Applicable for intra-state transactions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <div className="flex justify-end">
                    <button
                        onClick={handleContinue}
                            className="bg-primary text-primary-foreground px-8 py-4 rounded-[20px] hover:bg-primary/90 transition-all duration-200 flex items-center gap-3 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 font-semibold text-lg"
                    >
                            Continue to Line Items
                            <ArrowRight className="w-5 h-5" />
                    </button>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Company Information */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b border-border">
                            <h3 className="font-semibold text-foreground">Company Details</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary rounded-[20px] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                    🧾
                                </div>
                                <div className="font-bold text-foreground text-lg">J.V. JEWELLERS</div>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <div>Shop No. -2, Krishna Height</div>
                                <div>Jay Singh Pura, Mathura</div>
                                <div className="pt-2 border-t border-border">
                                    <div className="font-medium text-foreground">GSTIN:</div>
                                    <div>09ADCPV2673H1Z7</div>
                                    <div className="font-medium text-foreground mt-1">State:</div>
                                    <div>Uttar Pradesh (09)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Help & Tips */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 p-4 border-b border-border">
                            <h3 className="font-semibold text-foreground">Help & Tips</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <div className="font-medium text-foreground mb-2">Transaction Types</div>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>Retail: CGST + SGST</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span>Inter-city: IGST</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Purchase: Inward</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <div className="font-medium text-foreground mb-2">Input Modes</div>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                        <span>Component: Auto-calculated</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span>Direct: Manual entry</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                        <span>Reverse: From final amount</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailsPage;