"use client"
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import { Invoice, InvoiceData } from '@/types/invoiceTypes'
import { generateInvoiceHTML } from '@/utils/invoicePdfGenerator'
import { useShopProfile } from '@/contexts/ShopProfileContext'
import { Download, Eye } from 'lucide-react'

interface DownloadPDFModalProps {
    invoice: Invoice
    onClose: () => void
}

interface InvoiceDetails {
    invoice: Invoice
    lineItems: any[]
    globalRoundoff: number
}

const mapInvoiceToInvoiceData = (invoice: Invoice): InvoiceData => {
    return {
        type: invoice.transaction_type,
        mode: 'create',
        invoice_date: invoice.invoice_date,
        invoice_number: invoice.invoice_number,
        eway_bill: invoice.eway_bill || '',
        customer_id: invoice.buyer_id?.toString() || invoice.id.toString(),
        buyer_name: invoice.buyer_name,
        buyer_address: invoice.buyer_address,
        buyer_gstin: invoice.buyer_gstin || '',
        buyer_state: invoice.customer?.state?.state_name || '',
        buyer_state_code: invoice.customer?.state?.state_code || invoice.buyer_state_code?.toString() || ''
    }
}

export const DownloadPDFModal: React.FC<DownloadPDFModalProps> = ({ invoice, onClose }) => {
    const { shopProfile } = useShopProfile()
    const [loading, setLoading] = useState(false)
    const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(null)
    const [selectedCopies, setSelectedCopies] = useState({
        originalCopy: true,
        duplicateCopy: true,
        triplicateCopy: true
    })

    useEffect(() => {
        fetchInvoiceDetails()
    }, [invoice.id])

    const fetchInvoiceDetails = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/invoices/${invoice.id}`)
            if (!response.ok) throw new Error('Failed to fetch invoice details')

            const data = await response.json()
            // Map line items to expected format
            const mappedLineItems = (data.line_items || []).map((item: any) => ({
                hsn_sac_code: item.hsn_sac_code || '',
                description: item.description,
                quantity: Number(item.quantity),
                unit: item.unit,
                rate: Number(item.rate),
                taxableValue: Number(item.taxable_value),
                roundoff: 0, // Global roundoff is used instead
                taxes: item.taxes || [] // Include tax information
            }))

            setInvoiceDetails({
                invoice: data,
                lineItems: mappedLineItems,
                globalRoundoff: Number(data.roundoff) || 0
            })
        } catch (error) {
            console.error('Error fetching invoice details:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleGeneratePDF = () => {
        if (!invoiceDetails) return

        const copies = []
        if (selectedCopies.originalCopy) copies.push('ORIGINAL FOR RECIPIENT')
        if (selectedCopies.duplicateCopy) copies.push('DUPLICATE FOR TRANSPORTER')
        if (selectedCopies.triplicateCopy) copies.push('TRIPLICATE FOR SUPPLIER')

        if (copies.length === 0) {
            alert('Please select at least one copy type.')
            return
        }

        const pdfHtml = generateInvoiceHTML({
            invoiceData: mapInvoiceToInvoiceData(invoiceDetails.invoice),
            lineItems: invoiceDetails.lineItems,
            globalRoundoff: invoiceDetails.globalRoundoff,
            copies: copies as Array<'ORIGINAL FOR RECIPIENT' | 'DUPLICATE FOR TRANSPORTER' | 'TRIPLICATE FOR SUPPLIER'>,
            shopProfile: shopProfile
        })

        const newWindow = window.open('', '_blank')
        if (newWindow) {
            newWindow.document.write(pdfHtml)
            newWindow.document.close()
        }
    }

    const handlePreview = () => {
        if (!invoiceDetails) return

        const pdfHtml = generateInvoiceHTML({
            invoiceData: mapInvoiceToInvoiceData(invoiceDetails.invoice),
            lineItems: invoiceDetails.lineItems,
            globalRoundoff: invoiceDetails.globalRoundoff,
            copies: ['ORIGINAL FOR RECIPIENT'],
            shopProfile: shopProfile
        })

        // console.log("pdfHtml", pdfHtml);


        const newWindow = window.open('', '_blank')
        if (newWindow) {
            newWindow.document.write(pdfHtml)
            newWindow.document.close()
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading invoice details...</div>
            </div>
        )
    }

    if (!invoiceDetails) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-red-500">Failed to load invoice details</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Invoice Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-black">
                <h3 className="font-semibold text-lg mb-2">Invoice #{invoice.invoice_number}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                        <div className="font-medium">{invoice.buyer_name}</div>
                    </div>
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                        <div className="font-medium">₹{Number(invoice.total_invoice_value).toFixed(2)}</div>
                    </div>
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                        <div className="font-medium">{new Date(invoice.invoice_date).toLocaleDateString()}</div>
                    </div>
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <div className="font-medium capitalize">{invoice.transaction_type}</div>
                    </div>
                </div>
            </div>

            {/* Copy Selection */}
            <div>
                <h4 className="font-medium mb-3">Select Invoice Copies to Include:</h4>
                <div className="space-y-2 text-black">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedCopies.originalCopy}
                            onChange={(e) => setSelectedCopies(prev => ({ ...prev, originalCopy: e.target.checked }))}
                            className="rounded"
                        />
                        <span>Original for Recipient</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedCopies.duplicateCopy}
                            onChange={(e) => setSelectedCopies(prev => ({ ...prev, duplicateCopy: e.target.checked }))}
                            className="rounded"
                        />
                        <span>Duplicate for Transporter</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedCopies.triplicateCopy}
                            onChange={(e) => setSelectedCopies(prev => ({ ...prev, triplicateCopy: e.target.checked }))}
                            className="rounded"
                        />
                        <span>Triplicate for Supplier</span>
                    </label>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0 pt-4 border-t w-full">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full sm:w-auto"
                >
                    Cancel
                </Button>

                <Button
                    variant="outline"
                    onClick={handlePreview}
                    className="w-full sm:w-auto flex items-center justify-center"
                >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                </Button>

                <Button
                    onClick={handleGeneratePDF}
                    className="w-full sm:w-auto flex items-center justify-center"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                </Button>
            </div>

        </div>
    )
}
