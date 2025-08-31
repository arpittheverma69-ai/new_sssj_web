"use client"
import React, { useState, useEffect } from 'react';
import { showToast } from '@/utils/toast';
import LineItemsTable from '../create-invoice/LineItemsTable';
import { LineItem, TaxRateRow } from '@/types/invoiceTypes';
import { Plus, ArrowLeft, ArrowRight, Calculator, Package, Info, AlertCircle } from 'lucide-react';

interface LineItemsPageProps {
    lineItems: LineItem[];
    addLineItem: (item: Omit<LineItem, 'id' | 'taxableValue'>) => void;
    removeLineItem: (id: number) => void;
    updateLineItem: (id: number, updates: Partial<LineItem>) => void;
    invoiceData: any;
    globalRoundoff: number;
    setGlobalRoundoff: (value: number) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const LineItemsPage: React.FC<LineItemsPageProps> = ({
    lineItems,
    addLineItem,
    removeLineItem,
    updateLineItem,
    invoiceData,
    globalRoundoff,
    setGlobalRoundoff,
    nextStep,
    prevStep,
}) => {
    const [hsnSacOptions, setHsnSacOptions] = useState<TaxRateRow[]>([]);
    const [loadingHsnSac, setLoadingHsnSac] = useState(true);
    const [formData, setFormData] = useState({
        hsnSac: '',
        description: '',
        quantity: '1.000',
        unit: 'PCS',
        rate: '0.00',
        targetAmount: '0.00',
        directAmount: '0.00',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [cgstRate, setCgstRate] = useState('1.5');
    const [sgstRate, setSgstRate] = useState('1.5');

    // Fetch HSN/SAC codes from database
    useEffect(() => {
        const fetchHsnSacCodes = async () => {
            try {
                setLoadingHsnSac(true);
                const response = await fetch('/api/setting/taxrates');
                if (response.ok) {
                    const data = await response.json();
                    setHsnSacOptions(data);
                    // Set default values if data exists
                    if (data.length > 0 && !formData.hsnSac) {
                        setFormData(prev => ({
                            ...prev,
                            hsnSac: `${data[0].hsn_code} - ${data[0].description}`,
                            description: data[0].description
                        }));
                    }
                }
            } catch (error) {
                showToast.error(error instanceof Error ? error.message : 'Error fetching HSN/SAC codes');
            } finally {
                setLoadingHsnSac(false);
            }
        };

        fetchHsnSacCodes();
    }, []);

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.hsnSac || formData.hsnSac === '') {
            errors.hsnSac = 'HSN/SAC Code is required';
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddItem = () => {
        if (!validateForm()) {
            return;
        }

        // Ensure quantity is a whole number
        let quantity = (parseFloat(formData.quantity) || 1);
        let rate = parseFloat(formData.rate) || 0;
        let directAmount = parseFloat(formData.directAmount) || 0;
        let targetAmount = parseFloat(formData.targetAmount) || 0;

        // Handle different input modes
        if (invoiceData.mode === 'reverse') {
            // Reverse Calculation: Calculate quantity from target amount and rate
            if (targetAmount <= 0 || rate <= 0) {
                showToast.warning('Please enter valid target amount and rate values for reverse calculation.');
                return;
            }
            
            // Calculate total tax rate
            const totalTaxRate = isIGST 
                ? (parseFloat(cgstRate) + parseFloat(sgstRate)) / 100
                : (parseFloat(cgstRate) + parseFloat(sgstRate)) / 100;
            
            // Calculate taxable value from final target amount (including taxes)
            const taxableValueFromTarget = targetAmount / (1 + totalTaxRate);
            
            // Calculate quantity based on taxable value
            quantity = taxableValueFromTarget / rate;
        } else if (invoiceData.mode === 'direct') {
            // Direct Amount Entry: Use direct amount as taxable value
            if (directAmount <= 0) {
                showToast.warning('Please enter a valid direct amount.');
                return;
            }
            // For direct mode, we'll use quantity=1 and rate=directAmount
            quantity = 1;
            rate = directAmount;
        } else {
            // Component Entry: Normal validation
            if (quantity <= 0 || rate <= 0) {
                showToast.warning('Please enter valid quantity and rate values.');
                return;
            }
        }

        addLineItem({
            hsn_sac_code: formData.hsnSac.split(' - ')[0],
            description: formData.description,
            quantity,
            unit: formData.unit,
            rate,
            roundoff: 0, // Default roundoff to 0 since it will be editable per-item
        });

        // Reset form fields
        setFormData(prev => ({
            ...prev,
            quantity: '1', // Reset to 1 instead of 0.000
            rate: invoiceData.mode === 'direct' ? directAmount.toFixed(2) : '0.00',
            targetAmount: '0.00',
            directAmount: '0.00',
        }));
        setFormErrors({});
    };

    const handleUseExample = () => {
        setFormData(prev => ({
            ...prev,
            quantity: '10', // Changed to integer
            rate: '56000', // Changed to whole number
        }));
    };

    const handleContinue = () => {
        if (lineItems.length === 0) {
            showToast.warning('Please add at least one line item before continuing.');
            return;
        }
        nextStep();
    };

    const isIGST = String(invoiceData?.type || '').toLowerCase() === 'inter_state' || String(invoiceData?.type || '').toLowerCase() === 'outer_state';
    const calculateTotals = () => {
        const taxableValue = lineItems.reduce((sum, item) => sum + item.taxableValue, 0);

        const cgstAmt = isIGST ? 0 : taxableValue * (parseFloat(cgstRate) / 100);
        const sgstAmt = isIGST ? 0 : taxableValue * (parseFloat(sgstRate) / 100);
        const igstRate = (parseFloat(cgstRate) + parseFloat(sgstRate)) || 0;
        const igstAmt = isIGST ? taxableValue * (igstRate / 100) : 0;
        const totalBeforeRoundoff = taxableValue + cgstAmt + sgstAmt + igstAmt;
        const finalTotal = totalBeforeRoundoff + globalRoundoff; // Apply global roundoff to final total

        return {
            taxableValue,
            cgstAmount: cgstAmt,
            sgstAmount: sgstAmt,
            igstAmount: igstAmt,
            igstRate,
            totalBeforeRoundoff,
            globalRoundoff,
            finalTotal
        };
    };

    const totals = calculateTotals();

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-[20px] flex items-center justify-center text-white">
                        <Package className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Add Line Items</h1>
                        <p className="text-muted-foreground">Step 2: Configure products and services</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="xl:col-span-3 space-y-8">
                    {/* Add Line Items Card */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 p-6 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-[20px] flex items-center justify-center text-white">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Add Line Items</h2>
                                    <p className="text-muted-foreground">
                                        {invoiceData.mode === 'component' && 'Component Entry Mode'}
                                        {invoiceData.mode === 'direct' && 'Direct Amount Entry Mode'}
                                        {invoiceData.mode === 'reverse' && 'Reverse Calculation Mode'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                                {/* HSN/SAC Code */}
                                <div className="xl:col-span-1">
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        HSN/SAC Code <span className="text-destructive">*</span>
                                    </label>
                                    <select
                                        value={formData.hsnSac}
                                        onChange={(e) => {
                                            const selectedValue = e.target.value;
                                            const selectedOption = hsnSacOptions.find(option =>
                                                `${option.hsn_code} - ${option.description}` === selectedValue
                                            );
                                            setFormData({
                                                ...formData,
                                                hsnSac: selectedValue,
                                                description: selectedOption ? selectedOption.description : formData.description
                                            });
                                            if (formErrors.hsnSac) {
                                                setFormErrors({ ...formErrors, hsnSac: '' });
                                            }
                                        }}
                                        className={`w-full px-4 py-3 border rounded-[20px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50 ${formErrors.hsnSac ? 'border-destructive' : 'border-border'
                                            }`}
                                        disabled={loadingHsnSac}
                                    >
                                        {loadingHsnSac ? (
                                            <option>Loading HSN/SAC codes...</option>
                                        ) : hsnSacOptions.length === 0 ? (
                                            <option>No HSN/SAC codes available</option>
                                        ) : (
                                            <>
                                                <option value="">Select HSN/SAC Code</option>
                                                {hsnSacOptions.map((option) => (
                                                    <option key={option.id} value={`${option.hsn_code} - ${option.description}`}>
                                                        {option.hsn_code} - {option.description}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                    {formErrors.hsnSac && (
                                        <div className="text-destructive text-xs mt-1 flex items-center gap-1">
                                            <span>⚠</span> {formErrors.hsnSac}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2 xl:col-span-1">
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Description <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => {
                                            setFormData({ ...formData, description: e.target.value });
                                            if (formErrors.description) {
                                                setFormErrors({ ...formErrors, description: '' });
                                            }
                                        }}
                                        className={`w-full px-4 py-3 border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50 ${formErrors.description ? 'border-destructive' : 'border-border'
                                            }`}
                                        placeholder="Product description"
                                    />
                                    {formErrors.description && (
                                        <div className="text-destructive text-xs mt-1 flex items-center gap-1">
                                            <span>⚠</span> {formErrors.description}
                                        </div>
                                    )}
                                </div>

                                {/* Quantity - Show different fields based on input mode */}
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        {invoiceData.mode === 'reverse' ? 'Calculated Quantity' : 'Quantity'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        disabled={invoiceData.mode === 'reverse'}
                                        className={`w-full px-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50 ${invoiceData.mode === 'reverse' ? 'bg-muted cursor-not-allowed' : ''}`}
                                        placeholder="1.000"
                                    />
                                    {invoiceData.mode === 'reverse' && (
                                        <p className="text-xs text-muted-foreground mt-1">Auto-calculated from target amount ÷ rate</p>
                                    )}
                                </div>

                                {/* Unit */}
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Unit
                                    </label>
                                    <select
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        className="w-full px-4 py-3 border border-border rounded-[20px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                                    >
                                        <option>KGS</option>
                                        <option>GMS</option>
                                        <option>PCS</option>
                                        <option>NOS</option>
                                    </select>
                                </div>

                                {/* Rate */}
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        {invoiceData.mode === 'direct' ? 'Direct Amount' : `Rate per ${formData.unit}`}
                                    </label>
                                    {invoiceData.mode === 'direct' ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.directAmount}
                                            onChange={(e) => setFormData({ ...formData, directAmount: e.target.value })}
                                            className="w-full px-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                                            placeholder="Enter total amount directly"
                                        />
                                    ) : (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.rate}
                                            onChange={(e) => {
                                                const rate = e.target.value;
                                                if (invoiceData.mode === 'reverse') {
                                                    // Auto-calculate quantity when rate changes in reverse mode
                                                    const targetAmount = parseFloat(formData.targetAmount) || 0;
                                                    
                                                    if (parseFloat(rate) > 0 && targetAmount > 0) {
                                                        // Calculate total tax rate
                                                        const totalTaxRate = isIGST 
                                                            ? (parseFloat(cgstRate) + parseFloat(sgstRate)) / 100
                                                            : (parseFloat(cgstRate) + parseFloat(sgstRate)) / 100;
                                                        
                                                        // Calculate taxable value from final target amount (including taxes)
                                                        const taxableValueFromTarget = targetAmount / (1 + totalTaxRate);
                                                        
                                                        // Calculate quantity based on taxable value
                                                        const calculatedQuantity = (taxableValueFromTarget / parseFloat(rate)).toFixed(3);
                                                        
                                                        setFormData({
                                                            ...formData,
                                                            rate,
                                                            quantity: calculatedQuantity
                                                        });
                                                    } else {
                                                        setFormData({
                                                            ...formData,
                                                            rate,
                                                            quantity: '0.000'
                                                        });
                                                    }
                                                } else {
                                                    setFormData({ ...formData, rate });
                                                }
                                            }}
                                            className="w-full px-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                                            placeholder="0.00"
                                        />
                                    )}
                                </div>

                            </div>

                            {/* Target Amount Field - Only for Reverse Calculation */}
                            {invoiceData.mode === 'reverse' && (
                                <div className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 p-4 rounded-[20px] border border-orange-500/20">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-foreground mb-2">
                                                Target Amount (₹)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.targetAmount}
                                                onChange={(e) => {
                                                    const targetAmount = e.target.value;
                                                    const rate = parseFloat(formData.rate) || 0;
                                                    
                                                    if (rate > 0 && parseFloat(targetAmount) > 0) {
                                                        // Calculate total tax rate
                                                        const totalTaxRate = isIGST 
                                                            ? (parseFloat(cgstRate) + parseFloat(sgstRate)) / 100
                                                            : (parseFloat(cgstRate) + parseFloat(sgstRate)) / 100;
                                                        
                                                        // Calculate taxable value from final target amount (including taxes)
                                                        const taxableValueFromTarget = parseFloat(targetAmount) / (1 + totalTaxRate);
                                                        
                                                        // Calculate quantity based on taxable value
                                                        const calculatedQuantity = (taxableValueFromTarget / rate).toFixed(3);
                                                        
                                                        setFormData({
                                                            ...formData,
                                                            targetAmount,
                                                            quantity: calculatedQuantity
                                                        });
                                                    } else {
                                                        setFormData({
                                                            ...formData,
                                                            targetAmount,
                                                            quantity: '0.000'
                                                        });
                                                    }
                                                }}
                                                className="w-full px-4 py-3 border border-orange-500/30 rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-orange-500/50"
                                                placeholder="Enter desired total amount"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <div className="text-sm text-muted-foreground">
                                                <div className="font-medium text-orange-600 mb-1">Reverse Calculation</div>
                                                <div>Enter target amount and rate to auto-calculate quantity</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Direct Amount Info - Only for Direct Mode */}
                            {invoiceData.mode === 'direct' && (
                                <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 p-4 rounded-[20px] border border-yellow-500/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-[16px] flex items-center justify-center text-white text-lg">
                                            💰
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground mb-1">Direct Amount Entry</div>
                                            <div className="text-sm text-muted-foreground">
                                                Enter the total taxable amount directly. Quantity will be set to 1.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Add Item Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleAddItem}
                                    className="bg-green-500 text-white px-8 py-4 rounded-[20px] hover:bg-green-600 transition-all duration-200 flex items-center gap-3 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 font-semibold text-lg"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Item
                                </button>
                            </div>

                            {/* Example Section */}
                            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-6 rounded-[20px] border border-blue-500/20">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-semibold text-foreground mb-2">Example Calculation</div>
                                            <div className="text-sm text-muted-foreground">
                                                <span className="font-medium">10.468 KGS</span> of Silver Ornaments at{' '}
                                                <span className="font-medium">₹56,000.08</span> per KG ={' '}
                                                <span className="font-bold text-blue-600">₹5,86,208.83</span> taxable value
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleUseExample}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap px-4 py-2 rounded-[16px] bg-blue-500/10 hover:bg-blue-500/20 transition-all duration-200"
                                    >
                                        Use Example
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 p-6 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500 rounded-[20px] flex items-center justify-center text-white">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Line Items</h2>
                                    <p className="text-muted-foreground">
                                        {lineItems.length === 0 ? 'No items added yet' : `${lineItems.length} item${lineItems.length !== 1 ? 's' : ''} added`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {lineItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <div className="text-muted-foreground mb-2">No line items added yet</div>
                                    <div className="text-sm text-muted-foreground">Start by adding your first product or service above</div>
                                </div>
                            ) : (
                                <LineItemsTable lineItems={lineItems} onRemoveItem={removeLineItem} onUpdateItem={updateLineItem} />
                            )}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                        <button
                            onClick={prevStep}
                            className="w-full sm:w-auto bg-secondary text-secondary-foreground px-6 py-3 rounded-[20px] hover:bg-accent hover:text-accent-foreground transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Invoice Details
                        </button>

                        <button
                            onClick={handleContinue}
                            disabled={lineItems.length === 0}
                            className={`w-full sm:w-auto px-8 py-3 rounded-[20px] transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg ${lineItems.length === 0
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5'
                                }`}
                        >
                            Continue to Review
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Tax Configuration */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 p-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-500 rounded-[16px] flex items-center justify-center text-white">
                                    <Calculator className="w-4 h-4" />
                                </div>
                                <h3 className="font-semibold text-foreground">Tax Configuration</h3>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    CGST Rate (%)
                                </label>
                                <select
                                    value={cgstRate}
                                    onChange={(e) => setCgstRate(e.target.value)}
                                    disabled={isIGST}
                                    className="w-full px-3 py-2 border border-border rounded-[16px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                                >
                                    <option value="1.5">1.5%</option>
                                    <option value="2.5">2.5%</option>
                                    <option value="6">6%</option>
                                    <option value="9">9%</option>
                                    <option value="12">12%</option>
                                    <option value="18">18%</option>
                                    <option value="28">28%</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    SGST Rate (%)
                                </label>
                                <select
                                    value={sgstRate}
                                    onChange={(e) => setSgstRate(e.target.value)}
                                    disabled={isIGST}
                                    className="w-full px-3 py-2 border border-border rounded-[16px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                                >
                                    <option value="1.5">1.5%</option>
                                    <option value="2.5">2.5%</option>
                                    <option value="6">6%</option>
                                    <option value="9">9%</option>
                                    <option value="12">12%</option>
                                    <option value="18">18%</option>
                                    <option value="28">28%</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Summary */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 p-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-[16px] flex items-center justify-center text-white">
                                    <Calculator className="w-4 h-4" />
                                </div>
                                <h3 className="font-semibold text-foreground">Invoice Summary</h3>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Taxable Value:</span>
                                    <span className="font-semibold text-foreground">
                                        ₹{totals.taxableValue.toFixed(2)}
                                    </span>
                                </div>
                                {isIGST ? (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">IGST ({totals.igstRate}%):</span>
                                        <span className="font-semibold text-foreground">
                                            ₹{totals.igstAmount.toFixed(2)}
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">SGST ({sgstRate}%):</span>
                                            <span className="font-semibold text-foreground">
                                                ₹{totals.sgstAmount.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">CGST ({cgstRate}%):</span>
                                            <span className="font-semibold text-foreground">
                                                ₹{totals.cgstAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="border-t border-border pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Before Roundoff:</span>
                                    <span className="font-semibold text-foreground">
                                        ₹{totals.totalBeforeRoundoff.toFixed(2)}
                                    </span>
                                </div>
                                
                                {/* Global Roundoff Input */}
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Roundoff Adjustment:</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={globalRoundoff}
                                            onChange={(e) => setGlobalRoundoff(Number(e.target.value) || 0)}
                                            className="w-24 px-2 py-1 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-right"
                                            placeholder="0.00"
                                        />
                                        <span className="text-xs text-muted-foreground">₹</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center border-t border-border pt-3">
                                    <span className="font-bold text-lg text-foreground">Final Invoice Total:</span>
                                    <span className="text-2xl font-bold text-primary">
                                        ₹{totals.finalTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {lineItems.length === 0 && (
                                <div className="mt-4 p-3 bg-yellow-500/10 rounded-[16px] border border-yellow-500/20">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                                        <span className="text-sm text-yellow-700">Add line items to see calculations</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Help & Tips */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 p-4 border-b border-border">
                            <h3 className="font-semibold text-foreground">Help & Tips</h3>
                        </div>
                        <div className="p-4 space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>HSN/SAC codes are standardized product classifications</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>Quantity and rate determine the taxable value</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>Tax rates are automatically applied to calculate totals</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LineItemsPage;