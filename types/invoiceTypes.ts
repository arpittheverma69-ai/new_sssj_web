export interface LineItem {
    id: number;
    hsn_sac_code: string;
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    taxableValue: number;
    roundoff: number;
}

export interface InvoiceData {
    type: string;
    mode: string;
    invoice_date: string;
    invoice_number: string;
    eway_bill: string;
    customer_id: string;
    buyer_name: string;
    buyer_address: string;
    buyer_gstin: string;
    buyer_state: string;
    buyer_state_code: string;
    line_items?: LineItem[];
    cgst_rate?: number;
    sgst_rate?: number;
}
export interface Invoice {
    id: number;
    invoice_number: string;
    invoice_date: string;
    buyer_name: string;
    transaction_type: string;
    total_invoice_value: number;
    buyer_address: string;
    buyer_gstin?: string;
    eway_bill?: string;
    buyer_id?: number;
    buyer_state_code?: number;
    roundoff?: number;
    customer?: {
        id: number;
        name: string;
        state?: {
            id: number;
            state_name: string;
            state_code: string;
        };
    };
    line_items: Array<{
        description: string;
        quantity: number;
        unit: string;
        rate: number;
        taxable_value: number;
        hsn_sac_code: string;
        taxes: Array<{
            tax_name: string;
            tax_rate: number;
            tax_amount: number;
        }>;
    }>;
    flagged?: boolean;
}
export interface TaxRateRow {
    id: number;
    hsn_code: string;
    description: string;
    is_default?: boolean;
};

export interface ApiState {
    state: string;
    statecode: string;
}

export interface State {
    id: number;
    state: string;
    statecode: string;
}

export interface Customer {
    id: number;
    name: string;
    email?: string | null;
    phone: string;
    address: string;
    city: string;
    pincode?: string | null;
    gstin?: string | null;
    pan_number?: string | null;
    state_id?: number | null;
    state?: {
        id: number;
        state_name: string;
        state_code: string;
    };
    flagged?: boolean;
    _count?: {
        invoices: number;
    };
}

export const transactionTypes = [
    { value: 'retail', taxType: "CGST + SGST", label: 'Retail Sales', description: 'Intra-state sales with CGST + SGST', icon: '🏪', color: 'bg-blue-500' },
    { value: 'inter_state', taxType: "CGST + SGST", label: 'Inter-state Sales', description: 'Inter-state sales with CGST + SGST', icon: '🏙️', color: 'bg-cyan-500' },
    { value: 'outer_state', taxType: "IGST", label: 'Outer-state Sales', description: 'Out-of-state sales with IGST', icon: '🚚', color: 'bg-purple-500' },
    // { value: 'purchase', label: 'Purchase', description: 'Inward procurement', icon: '📦', color: 'bg-green-500' }
];