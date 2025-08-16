export interface ShopProfile {
    id?: number
    business_name: string
    gstin: string
    address: string
    city: string
    state: string
    state_code: string
    pincode?: string | null
    vat_tin?: string | null
    pan_number?: string | null
    bank_name?: string | null
    account_number?: string | null
    branch_ifsc?: string | null
}

export interface ShopProfileFormData {
    business_name: string
    gstin: string
    address: string
    city: string
    state: string
    state_code: string
    pincode?: string
    vat_tin?: string
    pan_number?: string
    bank_name?: string
    account_number?: string
    branch_ifsc?: string
}