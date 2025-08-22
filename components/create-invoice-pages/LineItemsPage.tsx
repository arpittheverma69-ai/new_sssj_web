"use client"
import React, { useState } from 'react';
import LineItemsTable from '../create-invoice/LineItemsTable';
import { LineItem } from '@/types/invoiceTypes';
import { Plus, ArrowLeft, ArrowRight, Calculator, Package, Info, AlertCircle } from 'lucide-react';

interface LineItemsPageProps {
    lineItems: LineItem[];
    addLineItem: (item: Omit<LineItem, 'id' | 'taxableValue'>) => void;
    removeLineItem: (id: number) => void;
    invoiceData: any;
    nextStep: () => void;
    prevStep: () => void;
}

const LineItemsPage: React.FC<LineItemsPageProps> = ({
    lineItems,
    addLineItem,
    removeLineItem,
    nextStep,
    prevStep,
}) => {
    const [formData, setFormData] = useState({
        hsnSac: '7113 - Jewellery',
        description: 'SILVER ORNAMENTS',
        quantity: '0.000',
        unit: 'KGS',
        rate: '0.00',
    });
    const [cgstRate, setCgstRate] = useState('1.5');
    const [sgstRate, setSgstRate] = useState('1.5');

    const handleAddItem = () => {
        const quantity = parseFloat(formData.quantity) || 0;
        const rate = parseFloat(formData.rate) || 0;

        if (quantity <= 0 || rate <= 0) {
            alert('Please enter valid quantity and rate values.');
            return;
        }

        addLineItem({
            hsn_sac_code: formData.hsnSac.split(' - ')[0],
            description: formData.description,
            quantity,
            unit: formData.unit,
            rate,
        });

        // Reset form fields
        setFormData(prev => ({
            ...prev,
            quantity: '0.000',
            rate: '0.00',
        }));
    };

    const handleUseExample = () => {
        setFormData(prev => ({
            ...prev,
            quantity: '10.468',
            rate: '56000.08',
        }));
    };

    const handleContinue = () => {
        if (lineItems.length === 0) {
            alert('Please add at least one line item before continuing.');
            return;
        }
        nextStep();
    };

    const calculateTotals = () => {
        const taxableValue = lineItems.reduce((sum, item) => sum + item.taxableValue, 0);
        const cgstAmount = taxableValue * (parseFloat(cgstRate) / 100);
        const sgstAmount = taxableValue * (parseFloat(sgstRate) / 100);
        const total = taxableValue + cgstAmount + sgstAmount;
        
        return { taxableValue, cgstAmount, sgstAmount, total };
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
                                    <p className="text-muted-foreground">Component Entry Mode</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                                {/* HSN/SAC Code */}
                        <div className="xl:col-span-1">
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                HSN/SAC Code
                            </label>
                            <select
                                value={formData.hsnSac}
                                onChange={(e) => setFormData({ ...formData, hsnSac: e.target.value })}
                                        className="w-full px-4 py-3 border border-border rounded-[20px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                            >
                                <option>7113 - Jewellery</option>
                                <option>7114 - Precious Stones</option>
                                        <option>7115 - Imitation Jewellery</option>
                                        <option>7116 - Gold Jewellery</option>
                            </select>
                        </div>

                                {/* Description */}
                        <div className="md:col-span-2 xl:col-span-1">
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                Description
                            </label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                                        placeholder="Product description"
                            />
                        </div>

                                {/* Quantity */}
                        <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                Quantity
                            </label>
                            <input
                                type="text"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        className="w-full px-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                                        placeholder="0.000"
                            />
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
                                        Rate per {formData.unit}
                            </label>
                            <input
                                type="text"
                                value={formData.rate}
                                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                        className="w-full px-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                                        placeholder="0.00"
                            />
                        </div>
                            </div>

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
                                <LineItemsTable lineItems={lineItems} onRemoveItem={removeLineItem} />
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
                            className={`w-full sm:w-auto px-8 py-3 rounded-[20px] transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg ${
                                lineItems.length === 0
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
                            </div>
                            
                            <div className="border-t border-border pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg text-foreground">Total Invoice Value:</span>
                                    <span className="text-2xl font-bold text-primary">
                                        ₹{totals.total.toFixed(2)}
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