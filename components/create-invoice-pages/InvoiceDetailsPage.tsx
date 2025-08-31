"use client"
import { Customer, InvoiceData, State, transactionTypes } from '@/types/invoiceTypes';
import React, { useEffect, useState } from 'react';
import { showToast } from '@/utils/toast';
import { Calendar, Hash, User, MapPin, Building2, CreditCard, Calculator, ArrowRight } from 'lucide-react';

interface InvoiceDetailsPageProps {
    invoiceData: InvoiceData;
    updateInvoiceData: (data: Partial<InvoiceData>) => void;
    selectedCustomer: (data: Partial<Customer>) => void;
    nextStep: () => void;
    states: State[];
}

const InvoiceDetailsPage: React.FC<InvoiceDetailsPageProps> = ({
    invoiceData,
    updateInvoiceData,
    selectedCustomer,
    nextStep,
    states,
}) => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [customers, setCustomers] = useState<Customer[]>();
    const [isFetchingCustomers, setIsFetchingCustomers] = useState(false);
    const [defaultCustomer, setDefaultCustomer] = useState(false);
    const [isLoadingInvoiceNumber, setIsLoadingInvoiceNumber] = useState(false);

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

    useEffect(() => {
        const fetchCustomer = async () => {
            setIsFetchingCustomers(true);
            try {
                const customerdata = await fetch('/api/customer/');
                if (!customerdata.ok) {
                    throw new Error('Failed to fetch customers');
                }
                const data = await customerdata.json();
                setCustomers(data);
            } catch (error) {
                showToast.error(error instanceof Error ? error.message : 'Unknown error in fetching customers');
            } finally {
                setIsFetchingCustomers(false);
            }
        }
        fetchCustomer();
    }, [])

    // Use a ref to track fetched invoice numbers to prevent duplicate fetches
    const fetchedInvoiceNumbers = React.useRef<Record<string, string>>({});

    // Fetch invoice number when transaction type changes
    useEffect(() => {
        const fetchInvoiceNumber = async () => {
            if (!invoiceData.type) return;

            // Skip if we already have an invoice number for this type
            if (fetchedInvoiceNumbers.current[invoiceData.type]) {
                updateInvoiceData({ invoice_number: fetchedInvoiceNumbers.current[invoiceData.type] });
                return;
            }

            setIsLoadingInvoiceNumber(true);
            try {
                const response = await fetch(`/api/invoices/next-number?type=${invoiceData.type}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch invoice number');
                }
                const data = await response.json();
                // Store the fetched invoice number in the ref
                fetchedInvoiceNumbers.current[invoiceData.type] = data.invoice_number;
                updateInvoiceData({ invoice_number: data.invoice_number });
            } catch (error) {
                showToast.error(error instanceof Error ? error.message : 'Failed to fetch invoice number');
            } finally {
                setIsLoadingInvoiceNumber(false);
            }
        };

        fetchInvoiceNumber();
        // Remove updateInvoiceData from dependencies to prevent infinite loops
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceData.type])

    const selectCustomer = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === "") {
            updateInvoiceData({
                eway_bill: '',
                customer_id: '',
                buyer_name: '',
                buyer_address: '',
                buyer_gstin: '',
                buyer_state: '',
                buyer_state_code: '',
            });
            setDefaultCustomer(false);
        } else {
            const selectedCustomerData = customers?.find(
                (custo) => custo.id === Number(e.target.value)
            );

            if (selectedCustomerData) {
                selectedCustomer(selectedCustomerData); // This will populate buyer fields via the hook
                setDefaultCustomer(true);
            }
        }
    };

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
                                            className={`relative cursor-pointer group transition-all duration-200 ${invoiceData.type === type.value
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
                                            <div className={`p-4 rounded-[20px] border-2 transition-all duration-200 ${invoiceData.type === type.value
                                                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25'
                                                : 'border-border hover:border-blue-300 bg-card'
                                                }`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 ${type.color} rounded-[16px] flex items-center justify-center text-lg`}>
                                                        {type.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-blue-500 ">{type.label}</div>
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
                                            className={`relative cursor-pointer group transition-all duration-200 ${invoiceData.mode === mode.value
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
                                            <div className={`p-4 rounded-[20px] border-2 transition-all duration-200 ${invoiceData.mode === mode.value
                                                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25'
                                                : 'border-border hover:border-blue-300 bg-card'
                                                }`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 ${mode.color} rounded-[16px] flex items-center justify-center text-white text-lg`}>
                                                        {mode.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-blue-500 ">{mode.label}</div>
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
                                            className={`w-full pl-10 pr-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 ${errors.invoice_date ? 'border-destructive' : 'hover:border-primary/50'
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
                                            className={`w-full pl-10 pr-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 ${errors.invoice_number ? 'border-destructive' : 'hover:border-primary/50'
                                                } ${isLoadingInvoiceNumber ? 'opacity-50' : ''}`}
                                            placeholder={isLoadingInvoiceNumber ? "Generating..." : "JVJ/021"}
                                            required
                                            disabled={isLoadingInvoiceNumber}
                                        />
                                        {isLoadingInvoiceNumber && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.invoice_number && (
                                        <div className="text-destructive text-xs mt-2 flex items-center gap-1">
                                            <span>⚠</span> {errors.invoice_number}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* E-way Bill */}
                            {/* <div>
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
                            </div> */}
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
                                    onChange={(e) => selectCustomer(e)}
                                    disabled={isFetchingCustomers}
                                    className="w-full px-4 py-3 border border-border rounded-[20px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50 disabled:opacity-50"
                                >
                                    <option value="">{isFetchingCustomers ? 'Loading customers...' : 'Select a customer from your database'}</option>
                                    {customers?.map((customer, index) => (
                                        <option key={index} value={customer.id}>{`${customer.name}, (${customer.phone})`}</option>
                                    ))}
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
                                        disabled={defaultCustomer}
                                        onChange={(e) => updateInvoiceData({ buyer_name: e.target.value })}
                                        className={`w-full pl-10 pr-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 ${errors.buyer_name ? 'border-destructive' : 'hover:border-primary/50'
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
                                        disabled={defaultCustomer}
                                        onChange={(e) => updateInvoiceData({ buyer_address: e.target.value })}
                                        className={`w-full pl-10 pr-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 resize-none ${errors.buyer_address ? 'border-destructive' : 'hover:border-primary/50'
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
                                            disabled={defaultCustomer}
                                            onChange={(e) => updateInvoiceData({ buyer_gstin: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                                            placeholder="22AAAAA0000A1Z5"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        State & Code
                                    </label>
                                    <select
                                        value={invoiceData.buyer_state_code}
                                        disabled={defaultCustomer}
                                        onChange={(e) => {
                                            const selectedState = states.find(
                                                (state) => state.statecode === e.target.value
                                            );
                                            if (selectedState) {
                                                updateInvoiceData({
                                                    buyer_state: selectedState.state,
                                                    buyer_state_code: selectedState.statecode,
                                                });
                                            }
                                        }}
                                        className="w-full px-4 py-3 border border-border rounded-[20px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state) => (
                                            <option key={state.id} value={state.statecode}>
                                                {state.state} ({state.statecode})
                                            </option>
                                        ))}
                                    </select>

                                </div>
                            </div>

                            {/* Tax Type Display */}
                            {(() => {
                                const t = String(invoiceData.type || '').toLowerCase();
                                const isIGST = t === 'inter_state' || t === 'outer_state';
                                return (
                                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-[20px] border border-blue-500/20">
                                        <div className="flex items-center gap-3">
                                            <Calculator className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <div className="font-semibold text-foreground">Tax Type: {isIGST ? 'IGST' : 'CGST + SGST'}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {isIGST ? 'Applicable for inter/outer-state transactions' : 'Applicable for intra-state transactions'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
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
                                        <span>Inter-state: IGST</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span>Outer-state: IGST</span>
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