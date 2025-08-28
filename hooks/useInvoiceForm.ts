"use client"
import { useEffect, useState } from 'react';
import { ApiState, InvoiceData, LineItem, State } from '../types/invoiceTypes';
import { Customer } from '@/types/shop-profile';

export const useInvoiceForm = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [lineItems, setLineItems] = useState<LineItem[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                setLoading(true);
                const statesResponse = await fetch('/api/states');
                if (!statesResponse.ok) {
                    throw new Error('Failed to fetch states');
                }
                const apiStates: ApiState[] = await statesResponse.json();

                // Transform API response to match component expectations
                const transformedStates: State[] = apiStates.map((apiState, index) => ({
                    id: index + 1, // Generate a temporary ID
                    state_name: apiState.state,
                    state_code: apiState.statecode,
                    state_numeric_code: index + 1 // Generate a temporary numeric code
                }));

                setStates(transformedStates);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchStates();
    }, []);

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
    const selectedCustomer = (data: Partial<Customer>) => {
        // try to find matching state from states[] by state name OR code
        const matchedState = states.find(
            (s) =>
                s.state_name.toLowerCase() === (data?.state?.state_name ?? "").toLowerCase() ||
                s.state_code.toLowerCase() === (data?.state?.state_code ?? "").toLowerCase()
        );

        setInvoiceData((prev) => ({
            ...prev,
            customer_id: data?.id ? String(data.id) : "",
            buyer_name: data?.name ?? "",
            buyer_address: data?.address ?? "",
            buyer_gstin: data?.gstin ?? "",
            buyer_state: matchedState ? matchedState.state_name : "",
            buyer_state_code: matchedState ? matchedState.state_code : "",
        }));
    };


    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    return {
        currentStep,
        lineItems,
        invoiceData,
        states,
        addLineItem,
        removeLineItem,
        updateInvoiceData,
        setInvoiceData,
        nextStep,
        prevStep,
        selectedCustomer,
        setCurrentStep,
        setLineItems, // expose for edit flow
    };
};