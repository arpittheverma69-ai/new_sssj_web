"use client";
import React, { useEffect, Suspense } from "react";
import LineItemsPage from "./LineItemsPage";
import ReviewGeneratePage from "./ReviewGeneratePage";
import { useInvoiceForm } from "@/hooks/useInvoiceForm";
import InvoiceStepper from "../create-invoice/InvoiceStepper";
import InvoiceDetailsPage from "./InvoiceDetailsPage";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const CreateInvoiceInner: React.FC = () => {
    const invoiceForm = useInvoiceForm();
    const searchParams = useSearchParams();

    // Load invoice when in edit mode
    useEffect(() => {
        const editId = searchParams.get("edit");
        if (!editId) return;

        const loadInvoice = async () => {
            const loadingToast = toast.loading("Loading invoice data for editing...", { closeOnClick: true });
            try {
                const res = await fetch(`/api/invoices/${editId}`);
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Invoice fetch error:", res.status, errorText);
                    throw new Error(`Failed to load invoice: ${res.status}`);
                }
                const inv = await res.json();
                console.log("Invoice data loaded:", inv);

                const invoice_date = inv.invoice_date
                    ? new Date(inv.invoice_date).toISOString().slice(0, 10)
                    : "";

                // Use customer's state data if available, otherwise fallback to stored values
                const customerState = inv.customer?.state;
                const matchedState = customerState
                    ? invoiceForm.states.find(
                        (s) => s.statecode === customerState.state_code || s.state === customerState.state_name
                    )
                    : invoiceForm.states.find(
                        (s) => s.statecode === inv.buyer_state_code?.toString()
                    );

                invoiceForm.setInvoiceData({
                    type: inv.transaction_type || "retail",
                    mode: "component",
                    invoice_date,
                    invoice_number: inv.invoice_number || "",
                    eway_bill: inv.eway_bill || "",
                    customer_id: inv.buyer_id ? String(inv.buyer_id) : "",
                    buyer_name: inv.buyer_name || "",
                    buyer_address: inv.buyer_address || "",
                    buyer_gstin: inv.buyer_gstin || "",
                    buyer_state: customerState?.state_name || matchedState?.state || "",
                    buyer_state_code: customerState?.state_code || matchedState?.statecode || "",
                });

                const mappedItems = (inv.line_items || []).map((item: any, idx: number) => ({
                    id: Date.now() + idx,
                    hsn_sac_code: item.hsn_sac_code || "",
                    description: item.description || "",
                    quantity: Number(item.quantity) || 0,
                    unit: item.unit || "",
                    rate: Number(item.rate) || 0,
                    taxableValue: Number(item.taxable_value) || 0,
                    roundoff: Number(item.roundoff) || 0,
                }));
                invoiceForm.setLineItems(mappedItems);

                // Set the global roundoff value from the fetched invoice
                invoiceForm.setGlobalRoundoff(Number(inv.roundoff) || 0);

                invoiceForm.setCurrentStep(1);
                toast.update(loadingToast, {
                    render: "Invoice data loaded successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                    closeOnClick: true
                });
            } catch (err) {
                console.error(err);
                toast.update(loadingToast, {
                    render: "Unable to load invoice for editing",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true
                });
            }
        };

        loadInvoice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <main className="flex-1 md:p-8">
            <div className="flex-1 max-md:pt-6">
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

const CreateInvoice: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading invoice...</div>}>
            <CreateInvoiceInner />
        </Suspense>
    );
};

export default CreateInvoice;
