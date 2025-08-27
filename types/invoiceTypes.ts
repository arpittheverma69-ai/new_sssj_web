export interface LineItem {
    id: number;
    hsn_sac_code: string;
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    taxableValue: number;
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
export interface TaxRateRow {
    id: number;
    hsn_code: string;
    description: string;
    cgst_rate: string;
    sgst_rate: string;
    igst_rate: string;
    is_default: boolean;
};

export interface State {
    id: number;
    state_name: string;
    state_code: string;
    state_numeric_code: number;
}

export interface ApiState {
    state: string;
    statecode: string;
}

export const transactionTypes = [
    { value: 'retail', taxType: "CGST + SGST", label: 'Retail Sales', description: 'Local sales with CGST + SGST', icon: '🏪', color: 'bg-blue-500' },
    { value: 'inter-city', taxType: "CGST + SGST", label: 'Inter-city Sales', description: 'Within-state but inter-city sales with CGST + SGST', icon: '🏙️', color: 'bg-cyan-500' },
    { value: 'outer-city', taxType: "IGST", label: 'Outer-city Sales', description: 'Out-of-state sales with IGST', icon: '🚚', color: 'bg-purple-500' },
    // { value: 'purchase', label: 'Purchase', description: 'Inward procurement', icon: '📦', color: 'bg-green-500' }
];