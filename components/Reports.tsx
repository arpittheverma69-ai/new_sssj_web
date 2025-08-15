"use client"
import React, { useState } from 'react'
import SalesInvoice from './small-components/SalesInvoice'
import InvoiceTable from './invoice-table/InvoicesTable'

type TimeRange = 'This Month' | 'Last Month' | 'This Year';

const Reports = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('This Month');
    return (
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <header className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Sales Reports</h2>
                    <p className="text-slate-500 text-sm md:text-base">Analyze your sales data and trends</p>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-slate-300 rounded-md py-2 pl-3 pr-8 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                        >
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <button className="bg-blue-500 text-white text-sm md:text-base font-semibold py-2 px-3 md:px-4 rounded-md flex items-center gap-2 hover:bg-blue-600">
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