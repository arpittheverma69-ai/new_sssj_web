"use client"
import React, { useState } from 'react'
import SalesInvoice from './small-components/SalesInvoice'
import InvoiceTable from './invoice-table/InvoicesTable'

type TimeRange = 'This Month' | 'Last Month' | 'This Year';

const Reports = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('This Month');
    return (
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Sales Reports</h2>
                    <p className="text-muted-foreground text-base md:text-lg">Analyze your sales data and trends</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            className="appearance-none bg-card border border-border rounded-[20px] py-3 pl-4 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                        >
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <button className="bg-primary text-primary-foreground text-sm font-semibold py-3 px-6 rounded-[20px] flex items-center gap-2 hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden md:inline">Refresh</span>
                    </button>
                </div>
            </header>
            <SalesInvoice />
            <InvoiceTable />
        </main>
    )
}

export default Reports