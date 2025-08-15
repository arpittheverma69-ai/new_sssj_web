interface ShopProfileData {
    shopName: string;
    gstin: string;
    address: string;
    city: string;
    state: string;
    stateCode: string;
    vatTin: string;
    panNumber: string;
    bankName: string;
    branchIfsc: string;
}

interface TaxRate {
    id: number;
    hsnCode: string;
    description: string;
    cgstRate: string;
    sgstRate: string;
    igstRate: string;
    isDefault: boolean;
}

interface InvoiceSettings {
    invoicePrefix: string;
    defaultTransactionType: string;
    numberOfDigits: string;
    defaultInputMode: string;
    startingNumber: string;
    invoiceCopies: {
        original: boolean;
        duplicate: boolean;
        triplicate: boolean;
    };
}