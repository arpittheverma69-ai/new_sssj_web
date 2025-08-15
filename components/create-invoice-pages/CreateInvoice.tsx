"use client"
import React from 'react';
import InvoiceDetailsPage from './InvoiceDetailsPage';
import LineItemsPage from './LineItemsPage';
import ReviewGeneratePage from './ReviewGeneratePage';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';
import InvoiceStepper from '../create-invoice/InvoiceStepper';

const CreateInvoice: React.FC = () => {
    const invoiceForm = useInvoiceForm();

    return (
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Create New Invoice</h1>

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