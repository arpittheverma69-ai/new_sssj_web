"use client"
import React, { useState, useEffect } from 'react'
import { Invoice } from '@/types/invoiceTypes'
import { toast } from 'react-toastify'

const SalesInvoice = () => {
    // const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSales: 0,
        taxCollected: 0,
        invoicesGenerated: 0,
        avgInvoiceValue: 0
    });

    // Fetch invoices and calculate stats
    useEffect(() => {
        const fetchInvoicesAndCalculateStats = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/invoices');
                const data = await response.json();
                const invoiceList = data.invoices || [];
                // setInvoices(invoiceList);
                // console.log("invoiceList", invoiceList);

                // Calculate statistics - ensure proper number conversion
                const totalSales = invoiceList.reduce(
                    (sum: number, inv: Invoice) => {
                        const invoiceValue = parseFloat(inv.total_invoice_value.toString()) || 0;
                        // console.log(`Invoice ${inv.invoice_number}: ${inv.total_invoice_value} -> ${invoiceValue}`);
                        return sum + invoiceValue;
                    },
                    0
                );

                // Calculate tax collected - better approach
                let taxCollected = 0;
                let taxableAmount = 0;

                invoiceList.forEach((inv: Invoice) => {
                    if (inv.line_items && Array.isArray(inv.line_items)) {
                        inv.line_items.forEach((item: any) => {
                            // Add taxable value - ensure number conversion
                            const taxableVal = parseFloat(item.taxable_value?.toString()) || 0;
                            taxableAmount += taxableVal;

                            // Calculate tax from line items
                            if (item.taxes && Array.isArray(item.taxes)) {
                                item.taxes.forEach((tax: any) => {
                                    const taxAmount = parseFloat(tax.tax_amount?.toString()) || 0;
                                    taxCollected += taxAmount;
                                });
                            }
                        });
                    }
                });

                // Fallback calculation if no tax data found
                if (taxCollected === 0 && taxableAmount > 0) {
                    // Use standard GST rates based on transaction type
                    taxCollected = taxableAmount * 0.03; //(1.5% CGST + 1.5% SGST or 3% IGST)
                } else if (taxCollected === 0 && totalSales > 0) {
                    // Last resort - estimate from total sales
                    taxCollected = totalSales * 0.15; // Approximate 15% effective tax rate
                }

                // console.log("=== FINAL CALCULATIONS ===");
                // console.log("Total Sales:", totalSales, "(Expected: 1011800)");
                // console.log("Taxable Amount:", taxableAmount);
                // console.log("Tax Collected:", taxCollected);

                const invoicesGenerated = invoiceList.length;
                const avgInvoiceValue = invoicesGenerated > 0 ? totalSales / invoicesGenerated : 0;

                setStats({
                    totalSales,
                    taxCollected,
                    invoicesGenerated,
                    avgInvoiceValue
                });
            } catch (error) {
                toast.error('Failed to fetch invoice statistics');
                console.error('Error fetching invoices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoicesAndCalculateStats();
    }, []);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Stat Cards Data
    const statCards = [
        {
            title: 'Total Sales',
            value: loading ? '...' : formatCurrency(stats.totalSales),
            change: stats.invoicesGenerated > 0 ? `${stats.invoicesGenerated} invoices` : 'No data',
            isPositive: true,
            icon: (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
            ),
            bgColor: 'bg-blue-500/10',
            textColor: 'text-blue-500',
            borderColor: 'border-blue-500/20'
        },
        {
            title: 'Tax Collected',
            value: loading ? '...' : formatCurrency(stats.taxCollected),
            change: stats.totalSales > 0 ? `${((stats.taxCollected / stats.totalSales) * 100).toFixed(1)}% of sales` : 'No data',
            isPositive: true,
            icon: <span className="font-bold text-lg md:text-xl">%</span>,
            bgColor: 'bg-purple-500/10',
            textColor: 'text-purple-500',
            borderColor: 'border-purple-500/20'
        },
        {
            title: 'Invoices Generated',
            value: loading ? '...' : stats.invoicesGenerated.toString(),
            change: 'Total count',
            isPositive: true,
            icon: (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
            ),
            bgColor: 'bg-yellow-500/10',
            textColor: 'text-yellow-500',
            borderColor: 'border-yellow-500/20'
        },
        {
            title: 'Avg. Invoice Value',
            value: loading ? '...' : formatCurrency(stats.avgInvoiceValue),
            change: stats.invoicesGenerated > 0 ? `Per invoice` : 'No data',
            isPositive: true,
            icon: (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
            ),
            bgColor: 'bg-green-500/10',
            textColor: 'text-green-500',
            borderColor: 'border-green-500/20'
        }
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
                <div
                    key={index}
                    className="group relative bg-card p-6 rounded-[24px] shadow-lg shadow-black/5 border border-border hover:shadow-xl hover:shadow-black/10 transition-all duration-300 hover:-translate-y-1"
                >
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 ${card.bgColor} rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-4">
                        <div className={`${card.bgColor} ${card.textColor} w-12 h-12 md:w-14 md:h-14 rounded-[20px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                            {card.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-muted-foreground text-sm font-medium mb-1">{card.title}</p>
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="text-lg md:text-xl font-bold text-foreground truncate">{card.value}</span>
                                <span className={`text-xs ${card.isPositive ? 'text-green-500' : 'text-red-500'} font-semibold flex items-center gap-1`}>
                                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d={card.isPositive ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"} clipRule="evenodd" />
                                    </svg>
                                    <span className="truncate">{card.change}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Border accent */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${card.borderColor} rounded-b-[24px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>
            ))}
        </div>
    )
}

export default SalesInvoice