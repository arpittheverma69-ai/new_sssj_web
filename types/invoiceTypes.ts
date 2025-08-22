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

