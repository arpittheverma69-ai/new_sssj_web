"use client"
import React, { useState } from 'react';
import InvoiceSlipPreview from '../create-invoice/InvoiceSlipPreview';
import { LineItem } from '@/types/invoiceTypes';
import { 
    FileText, 
    Calendar, 
    Hash, 
    User, 
    Truck, 
    Calculator, 
    Package, 
    CheckCircle, 
    Download, 
    Send, 
    ArrowLeft, 
    Eye, 
    Printer, 
    Share2, 
    AlertCircle, 
    Info,
    DollarSign,
    Receipt,
    Clock,
    Shield
} from 'lucide-react';

interface ReviewGeneratePageProps {
    invoiceData: any;
    lineItems: LineItem[];
    prevStep: () => void;
}

const ReviewGeneratePage: React.FC<ReviewGeneratePageProps> = ({
    invoiceData,
    lineItems,
    prevStep,
}) => {
    const [cgstRate] = useState('1.5');
    const [sgstRate] = useState('1.5');
    const [selectedCopies, setSelectedCopies] = useState({
        originalCopy: true,
        duplicateCopy: true,
        triplicateCopy: true,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const taxableValue = lineItems.reduce((sum, item) => sum + item.taxableValue, 0);
    const cgstAmount = taxableValue * (parseFloat(cgstRate) / 100);
    const sgstAmount = taxableValue * (parseFloat(sgstRate) / 100);
    const totalInvoice = taxableValue + cgstAmount + sgstAmount;

    const handleCopyChange = (copy: keyof typeof selectedCopies) => {
        setSelectedCopies(prev => ({
            ...prev,
            [copy]: !prev[copy],
        }));
    };

    const handleGeneratePDF = async () => {
        setIsGenerating(true);
        // Simulate PDF generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsGenerating(false);
        alert('PDF generated successfully!');
    };

    const handleSubmitInvoice = async () => {
        setIsSubmitting(true);
        // Simulate invoice submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        alert('Invoice submitted successfully!');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const getTransactionTypeIcon = (type: string) => {
        switch (type) {
            case 'retail': return <Receipt className="w-5 h-5" />;
            case 'inter-city': return <Truck className="w-5 h-5" />;
            case 'purchase': return <Package className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    const getTransactionTypeLabel = (type: string) => {
        switch (type) {
            case 'retail': return 'Retail Sales';
            case 'inter-city': return 'Inter-city Sales';
            case 'purchase': return 'Purchase';
            default: return type;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-[20px] flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Review & Generate</h1>
                        <p className="text-muted-foreground text-lg">Final review and generation</p>
                    </div>
                </div>
                <div className="text-sm text-muted-foreground">Step 3 of 3</div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="xl:col-span-3 space-y-8">
                    {/* Invoice Review Section */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                            <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6 text-white" />
                                <h2 className="text-xl font-semibold text-white">Invoice Review</h2>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Invoice Details */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                        <Hash className="w-5 h-5 text-blue-500" />
                                        Invoice Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-[16px]">
                                            <span className="text-muted-foreground">Invoice Number:</span>
                                            <span className="font-semibold text-foreground">{invoiceData.invoice_number}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-[16px]">
                                            <span className="text-muted-foreground">Invoice Date:</span>
                                            <span className="font-semibold text-foreground">
                                                {new Date(invoiceData.invoice_date).toLocaleDateString('en-IN')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-[16px]">
                                            <span className="text-muted-foreground">Transaction Type:</span>
                                            <div className="flex items-center gap-2">
                                                {getTransactionTypeIcon(invoiceData.type)}
                                                <span className="font-semibold text-foreground">
                                                    {getTransactionTypeLabel(invoiceData.type)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-[16px]">
                                            <span className="text-muted-foreground">Buyer Name:</span>
                                            <span className="font-semibold text-foreground">{invoiceData.buyer_name}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tax Summary */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                        <Calculator className="w-5 h-5 text-green-500" />
                                        Tax Summary
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-[16px]">
                                            <span className="text-muted-foreground">Taxable Value:</span>
                                            <span className="font-semibold text-foreground">{formatCurrency(taxableValue)}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-[16px]">
                                            <span className="text-muted-foreground">CGST ({cgstRate}%):</span>
                                            <span className="font-semibold text-foreground">{formatCurrency(cgstAmount)}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-[16px]">
                                            <span className="text-muted-foreground">SGST ({sgstRate}%):</span>
                                            <span className="font-semibold text-foreground">{formatCurrency(sgstAmount)}</span>
                                        </div>
                                        <div className="border-t border-border my-3"></div>
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-[16px] border border-green-200">
                                            <span className="text-lg font-bold text-foreground">Total Invoice Value:</span>
                                            <span className="text-xl font-bold text-green-600">{formatCurrency(totalInvoice)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Section */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
                            <div className="flex items-center gap-3">
                                <Package className="w-6 h-6 text-white" />
                                <h2 className="text-xl font-semibold text-white">Line Items</h2>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left p-3 font-semibold text-foreground">HSN/SAC</th>
                                            <th className="text-left p-3 font-semibold text-foreground">Description</th>
                                            <th className="text-right p-3 font-semibold text-foreground">Quantity</th>
                                            <th className="text-right p-3 font-semibold text-foreground">Rate</th>
                                            <th className="text-right p-3 font-semibold text-foreground">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lineItems.map((item, index) => (
                                            <tr key={item.id} className={`border-b border-border/50 ${index % 2 === 0 ? 'bg-muted/20' : ''}`}>
                                                <td className="p-3 font-mono text-sm">{item.hsn_sac_code}</td>
                                                <td className="p-3 font-medium">{item.description}</td>
                                                <td className="p-3 text-right">
                                                    <span className="font-semibold">{item.quantity.toFixed(3)}</span>
                                                    <span className="text-muted-foreground ml-1">{item.unit}</span>
                                                </td>
                                                <td className="p-3 text-right font-semibold">{formatCurrency(item.rate)}</td>
                                                <td className="p-3 text-right font-bold text-foreground">{formatCurrency(item.taxableValue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Slip Preview */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                            <div className="flex items-center gap-3">
                                <Eye className="w-6 h-6 text-white" />
                                <h2 className="text-xl font-semibold text-white">Invoice Slip Preview</h2>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <InvoiceSlipPreview
                                invoiceData={invoiceData}
                                lineItems={lineItems}
                                cgstRate={parseFloat(cgstRate)}
                                sgstRate={parseFloat(sgstRate)}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Generation Options */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4">
                            <div className="flex items-center gap-2">
                                <Printer className="w-5 h-5 text-white" />
                                <h3 className="font-semibold text-white">Generation Options</h3>
                            </div>
                        </div>
                        
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block font-medium text-foreground mb-3">Invoice Copies</label>
                                <div className="space-y-3">
                                    {[
                                        { key: 'originalCopy', label: 'Original for Recipient', icon: <FileText className="w-4 h-4" /> },
                                        { key: 'duplicateCopy', label: 'Duplicate for Transporter', icon: <Truck className="w-4 h-4" /> },
                                        { key: 'triplicateCopy', label: 'Triplicate for Supplier', icon: <Package className="w-4 h-4" /> }
                                    ].map(({ key, label, icon }) => (
                                        <label key={key} className="flex items-center gap-3 p-3 rounded-[12px] hover:bg-muted/50 cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={selectedCopies[key as keyof typeof selectedCopies]}
                                                onChange={() => handleCopyChange(key as keyof typeof selectedCopies)}
                                                className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            />
                                            <div className="flex items-center gap-2">
                                                {icon}
                                                <span className="text-sm text-foreground">{label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-white" />
                                <h3 className="font-semibold text-white">Quick Actions</h3>
                            </div>
                        </div>
                        
                        <div className="p-4 space-y-3">
                            <button
                                onClick={handleGeneratePDF}
                                disabled={isGenerating}
                                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-[16px] font-medium hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                {isGenerating ? 'Generating...' : 'Generate PDF'}
                            </button>
                            
                            <button
                                onClick={handleSubmitInvoice}
                                disabled={isSubmitting}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-[16px] font-medium hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                {isSubmitting ? 'Submitting...' : 'Submit Invoice'}
                            </button>
                            
                            <button className="w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-[16px] font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200 flex items-center justify-center gap-2">
                                <Share2 className="w-4 h-4" />
                                Share Invoice
                            </button>
                        </div>
                    </div>

                    {/* Invoice Info */}
                    <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
                            <div className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-white" />
                                <h3 className="font-semibold text-white">Invoice Info</h3>
                            </div>
                        </div>
                        
                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-[12px]">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium text-foreground">Created</div>
                                    <div className="text-xs text-muted-foreground">Just now</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-[12px]">
                                <Shield className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium text-foreground">Status</div>
                                    <div className="text-xs text-muted-foreground">Draft</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-[12px]">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium text-foreground">Total Value</div>
                                    <div className="text-xs text-muted-foreground">{formatCurrency(totalInvoice)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <button
                    onClick={prevStep}
                    className="bg-secondary text-secondary-foreground px-6 py-3 rounded-[20px] font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200 flex items-center gap-2 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Line Items
                </button>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    <span>Review all details before generating the invoice</span>
                </div>
            </div>
        </div>
    );
};

export default ReviewGeneratePage;