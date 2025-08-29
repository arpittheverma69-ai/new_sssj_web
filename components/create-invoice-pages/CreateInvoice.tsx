"use client"
import React, { useEffect } from 'react';
import LineItemsPage from './LineItemsPage';
import ReviewGeneratePage from './ReviewGeneratePage';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';
import InvoiceStepper from '../create-invoice/InvoiceStepper';
import InvoiceDetailsPage from './InvoiceDetailsPage';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

const CreateInvoice: React.FC = () => {
    const invoiceForm = useInvoiceForm();
    const searchParams = useSearchParams();

    // Load invoice when in edit mode
    useEffect(() => {
        const editId = searchParams.get('edit');
        if (!editId) return;

        const loadInvoice = async () => {
            try {
                const res = await fetch(`/api/invoices/${editId}`);
                if (!res.ok) {
                    throw new Error('Failed to load invoice');
                }
                const inv = await res.json();

                // Map API invoice to form state
                const invoice_date = inv.invoice_date ? new Date(inv.invoice_date).toISOString().slice(0, 10) : '';

                // Attempt to find state name from buyer_state_code using loaded states
                const matchedState = invoiceForm.states.find(s => s.state_code === (inv.buyer_state_code || ''));

                invoiceForm.setInvoiceData({
                    type: inv.transaction_type || 'retail',
                    mode: 'component',
                    invoice_date,
                    invoice_number: inv.invoice_number || '',
                    eway_bill: inv.eway_bill || '',
                    customer_id: inv.buyer_id ? String(inv.buyer_id) : '',
                    buyer_name: inv.buyer_name || '',
                    buyer_address: inv.buyer_address || '',
                    buyer_gstin: inv.buyer_gstin || '',
                    buyer_state: matchedState ? matchedState.state_name : '',
                    buyer_state_code: inv.buyer_state_code || '',
                });

                // Map line items
                const mappedItems = (inv.line_items || []).map((item: any, idx: number) => ({
                    id: Date.now() + idx,
                    hsn_sac_code: item.hsn_sac_code || '',
                    description: item.description || '',
                    quantity: Number(item.quantity) || 0,
                    unit: item.unit || '',
                    rate: Number(item.rate) || 0,
                    taxableValue: Number(item.taxable_value) || 0,
                    roundoff: Number(item.roundoff) || 0,
                }));
                invoiceForm.setLineItems(mappedItems);

                // Optionally navigate to first step
                invoiceForm.setCurrentStep(1);
            } catch (err) {
                console.error(err);
                toast.error('Unable to load invoice for editing');
            }
        };

        loadInvoice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <div className="flex-1">
                <InvoiceStepper currentStep={invoiceForm.currentStep} />

                {invoiceForm.currentStep === 1 && (
                    <InvoiceDetailsPage {...invoiceForm} />
                )}

                {invoiceForm.currentStep === 2 && (
                    <LineItemsPage {...invoiceForm} />
                )}

                {invoiceForm.currentStep === 3 && (
                    <ReviewGeneratePage {...invoiceForm} />
                )}
            </div>
        </main>
    );
};

export default CreateInvoice;