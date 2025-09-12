"use client"
import React, { useState } from 'react';
import { showToast } from '@/utils/toast';
import InvoiceSlipPreview from '../create-invoice/InvoiceSlipPreview';
import { LineItem } from '@/types/invoiceTypes';
import {
    FileText,
    Hash,
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
import { useSearchParams } from 'next/navigation';
import { useShopProfile } from '@/contexts/ShopProfileContext';

interface ReviewGeneratePageProps {
    invoiceData: any;
    lineItems: LineItem[];
    globalRoundoff: number;
    prevStep: () => void;
}

const ReviewGeneratePage: React.FC<ReviewGeneratePageProps> = ({
    invoiceData,
    lineItems,
    globalRoundoff,
    prevStep,
}) => {
    const searchParams = useSearchParams();
    const { shopProfile } = useShopProfile();
    const editId = searchParams.get('edit');
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

    const isIGST = String(invoiceData?.type || '').toLowerCase() === 'outer_state';
    const igstRate = (parseFloat(cgstRate) + parseFloat(sgstRate)) || 0;
    const cgstAmount = isIGST ? 0 : taxableValue * (parseFloat(cgstRate) / 100);
    const sgstAmount = isIGST ? 0 : taxableValue * (parseFloat(sgstRate) / 100);
    const igstAmount = isIGST ? taxableValue * (igstRate / 100) : 0;
    const totalTax = cgstAmount + sgstAmount + igstAmount;
    const totalBeforeRoundoff = taxableValue + totalTax;
    const totalInvoice = totalBeforeRoundoff + globalRoundoff;

    const handleCopyChange = (copy: keyof typeof selectedCopies) => {
        setSelectedCopies(prev => ({
            ...prev,
            [copy]: !prev[copy],
        }));
    };

    const handleGeneratePDF = async () => {
        setIsGenerating(true);
        try {
            // Map selected copies to PDF generator format
            const selectedCopyTypes: string[] = [];
            if (selectedCopies.originalCopy) selectedCopyTypes.push('ORIGINAL FOR RECIPIENT');
            if (selectedCopies.duplicateCopy) selectedCopyTypes.push('DUPLICATE FOR TRANSPORTER');
            if (selectedCopies.triplicateCopy) selectedCopyTypes.push('TRIPLICATE FOR SUPPLIER');

            // If no copies are selected, show a warning
            if (selectedCopyTypes.length === 0) {
                showToast.warning('Please select at least one invoice copy to generate.');
                setIsGenerating(false);
                return;
            }

            const { downloadInvoicePDF } = await import('@/utils/invoicePdfGenerator');
            const pdfData = {
                invoiceData,
                lineItems,
                cgstRate: parseFloat(cgstRate),
                sgstRate: parseFloat(sgstRate),
                globalRoundoff: globalRoundoff,
                copies: selectedCopyTypes,
                shopProfile
            };
            await downloadInvoicePDF(pdfData);
            showToast.success('PDF generated and download started!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showToast.error('Error generating PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };


    const handleSubmitInvoice = async () => {
        setIsSubmitting(true);
        const toastId = showToast.loading('Submitting invoice...');

        try {
            // Prepare invoice data for API
            const derivedTaxType = (() => {
                const t = (invoiceData.type || '').toLowerCase();
                if (t === 'outer_state') return 'IGST';
                return 'CGST+SGST';
            })();

            const invoicePayload: any = {
                invoice_number: invoiceData.invoice_number,
                // Only send date if present; otherwise let backend keep existing
                invoice_date: invoiceData.invoice_date ? invoiceData.invoice_date : undefined,
                transaction_type: invoiceData.type,
                input_mode: invoiceData.mode,
                eway_bill: invoiceData.eway_bill,
                // Only send buyer_id if present; avoid 0 which is invalid
                buyer_id: invoiceData.customer_id ? Number(invoiceData.customer_id) : undefined,
                buyer_name: invoiceData.buyer_name,
                buyer_address: invoiceData.buyer_address,
                buyer_gstin: invoiceData.buyer_gstin,
                // Convert to number or omit
                buyer_state_code: invoiceData.buyer_state_code ? Number(invoiceData.buyer_state_code) : undefined,
                tax_type: derivedTaxType,
                total_invoice_value: totalInvoice,
                roundoff: globalRoundoff,
                line_items: lineItems.map(item => ({
                    hsn_sac_code: item.hsn_sac_code,
                    description: item.description,
                    quantity: item.quantity,
                    unit: item.unit,
                    rate: item.rate,
                    taxable_value: item.taxableValue,
                    taxes: isIGST
                        ? [
                            {
                                tax_name: 'IGST',
                                tax_rate: Number(cgstRate) + Number(sgstRate),
                                tax_amount: item.taxableValue * (Number(cgstRate) + Number(sgstRate)) / 100,
                            },
                        ]
                        : [
                            {
                                tax_name: 'CGST',
                                tax_rate: Number(cgstRate),
                                tax_amount: item.taxableValue * Number(cgstRate) / 100
                            },
                            {
                                tax_name: 'SGST',
                                tax_rate: Number(sgstRate),
                                tax_amount: item.taxableValue * Number(sgstRate) / 100
                            }
                        ]
                }))
            };
            // console.log("invoicePayload", invoicePayload);

            const isEdit = Boolean(editId);
            const url = isEdit ? `/api/invoices/${editId}` : '/api/invoices';
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(invoicePayload),
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type') || '';
                const msg = contentType.includes('application/json') ? (await response.json()).error : await response.text();
                throw new Error(msg || 'Failed to submit invoice');
            }

            const result = await response.json();

            showToast.update(toastId, 'success', `${isEdit ? 'Invoice updated' : 'Invoice submitted'} successfully!`);
            setIsSubmitting(false);

            // Optionally redirect to invoices list or reset form
            // window.location.href = '/dashboard/all-invoice';

        } catch (error) {
            console.error('Error submitting invoice:', error);
            let errorMessage = 'Failed to submit invoice. Please try again.';

            if (error instanceof Error) {
                // Handle specific error types
                if (error.message.includes('duplicate') || error.message.includes('already exists')) {
                    errorMessage = 'Invoice number already exists. Please use a different invoice number.';
                } else if (error.message.includes('required')) {
                    errorMessage = 'Please fill in all required fields before submitting.';
                } else if (error.message.includes('validation')) {
                    errorMessage = 'Please check your input data and try again.';
                } else {
                    errorMessage = error.message;
                }
            }

            showToast.update(toastId, 'error', errorMessage);
            setIsSubmitting(false);
        }
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
            case 'inter_state': return <Truck className="w-5 h-5" />;
            case 'outer_state': return <Truck className="w-5 h-5" />;
            case 'purchase': return <Package className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    const getTransactionTypeLabel = (type: string) => {
        switch (type) {
            case 'retail': return 'Retail Sales';
            case 'inter_state': return 'Inter-state Sales';
            case 'outer_state': return 'Outer-state Sales';
            case 'purchase': return 'Purchase';
            default: return type;
        }
    };

    return (
        <div className="max-w-7xl mx-auto md:p-8">
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
                                        {isIGST ? (
                                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-[16px]">
                                                <span className="text-muted-foreground">IGST ({igstRate}%):</span>
                                                <span className="font-semibold text-foreground">{formatCurrency(igstAmount)}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-[16px]">
                                                    <span className="text-muted-foreground">CGST ({cgstRate}%):</span>
                                                    <span className="font-semibold text-foreground">{formatCurrency(cgstAmount)}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-[16px]">
                                                    <span className="text-muted-foreground">SGST ({sgstRate}%):</span>
                                                    <span className="font-semibold text-foreground">{formatCurrency(sgstAmount)}</span>
                                                </div>
                                            </>
                                        )}
                                        <div className="border-t border-border my-3"></div>
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-[16px] border border-green-200 dark:border-green-800">
                                            <span className="text-lg font-bold text-black">Total Invoice Value:</span>
                                            <span className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalInvoice)}</span>
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

                        <div className="p-2 md:p-6">
                            <InvoiceSlipPreview
                                invoiceData={invoiceData}
                                lineItems={lineItems}
                                cgstRate={parseFloat(cgstRate)}
                                sgstRate={parseFloat(sgstRate)}
                                globalRoundoff={globalRoundoff}
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