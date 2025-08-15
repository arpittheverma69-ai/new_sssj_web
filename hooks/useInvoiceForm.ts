"use client"
import { useState } from 'react';
import { InvoiceData, LineItem } from '../types/invoiceTypes';

export const useInvoiceForm = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [lineItems, setLineItems] = useState<LineItem[]>([]);
    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        type: 'retail',
        mode: 'component',
        invoice_date: '',
        invoice_number: 'JVJ/021',
        eway_bill: '',
        customer_id: '',
        buyer_name: '',
        buyer_address: '',
        buyer_gstin: '',
        buyer_state: '',
        buyer_state_code: '',
    });

    const addLineItem = (item: Omit<LineItem, 'id' | 'taxableValue'>) => {
        const taxableValue = item.quantity * item.rate;
        const newItem: LineItem = {
            ...item,
            id: Date.now(),
            taxableValue,
        };
        setLineItems([...lineItems, newItem]);
    };

    const removeLineItem = (id: number) => {
        setLineItems(lineItems.filter(item => item.id !== id));
    };

    const updateInvoiceData = (data: Partial<InvoiceData>) => {
        setInvoiceData(prev => ({
            ...prev,
            ...data,
        }));
    };

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    return {
        currentStep,
        lineItems,
        invoiceData,
        addLineItem,
        removeLineItem,
        updateInvoiceData,
        nextStep,
        prevStep,
        setCurrentStep,
    };
};