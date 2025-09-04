"use client"
import { useEffect, useState } from 'react';
import { ApiState, Customer, InvoiceData, LineItem, State } from '../types/invoiceTypes';

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
                    state: apiState.state,
                    statecode: apiState.statecode
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
        invoice_number: '',
        eway_bill: '',
        customer_id: '',
        buyer_name: '',
        buyer_address: '',
        buyer_gstin: '',
        buyer_state: '',
        buyer_state_code: '',
    });

    const [globalRoundoff, setGlobalRoundoff] = useState<number>(0);

    const addLineItem = (item: Omit<LineItem, 'id' | 'taxableValue'>) => {
        const taxableValue = item.quantity * item.rate;
        const newItem: LineItem = {
            ...item,
            id: Date.now(),
            taxableValue,
            roundoff: 0, // Remove per-item roundoff
        };
        setLineItems([...lineItems, newItem]);
    };

    // Clear all line items (useful for edit mode)
    const clearLineItems = () => {
        setLineItems([]);
    };

    const removeLineItem = (id: number) => {
        setLineItems(lineItems.filter(item => item.id !== id));
    };

    // Update a single line item (e.g., quantity, rate, etc.)
    const updateLineItem = (id: number, patch: Partial<LineItem>) => {
        setLineItems(prev => prev.map(item => {
            if (item.id !== id) return item;

            const updatedItem = { ...item, ...patch };

            // Recalculate taxableValue if relevant fields change
            if (
                patch.hasOwnProperty('quantity') ||
                patch.hasOwnProperty('rate')
            ) {
                const quantity = updatedItem.quantity;
                const rate = updatedItem.rate;
                updatedItem.taxableValue = quantity * rate;
            }

            return updatedItem as LineItem;
        }));
    };

    const updateInvoiceData = (data: Partial<InvoiceData>) => {
        setInvoiceData(prev => ({
            ...prev,
            ...data,
        }));
    };
    const selectedCustomer = (data: Partial<Customer>) => {
        // try to find matching state from states[] by state name OR code
        const matchedState = data?.state
            ? states.find(
                (s) =>
                    (s.state?.toLowerCase() === data.state?.state_name?.toLowerCase()) ||
                    (s.statecode?.toLowerCase() === data.state?.state_code?.toLowerCase())
            )
            : undefined;

        setInvoiceData((prev) => ({
            ...prev,
            customer_id: data?.id ? String(data.id) : "",
            buyer_name: data?.name ?? "",
            buyer_address: data?.address ?? "",
            buyer_gstin: data?.gstin ?? "",
            buyer_state: matchedState ? matchedState.state : "",
            buyer_state_code: matchedState ? matchedState.statecode : "",
        }));
    };

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    return {
        currentStep,
        lineItems,
        invoiceData,
        states,
        globalRoundoff,
        setGlobalRoundoff,
        addLineItem,
        removeLineItem,
        updateLineItem,
        updateInvoiceData,
        setInvoiceData,
        nextStep,
        prevStep,
        selectedCustomer,
        setCurrentStep,
        setLineItems, // expose for edit flow
        clearLineItems, // expose for clearing items
    };
};