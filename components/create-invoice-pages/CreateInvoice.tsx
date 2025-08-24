"use client"
import React from 'react';
import LineItemsPage from './LineItemsPage';
import ReviewGeneratePage from './ReviewGeneratePage';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';
import InvoiceStepper from '../create-invoice/InvoiceStepper';
import InvoiceDetailsPage from './InvoiceDetailsPage';

const CreateInvoice: React.FC = () => {
    const invoiceForm = useInvoiceForm();

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