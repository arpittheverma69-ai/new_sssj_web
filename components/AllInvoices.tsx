import React from 'react'
import RecentInvoices from './invoice-table/InvoicesTable'

const AllInvoices = () => {
    return (
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <header className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">All Invoice</h2>
                    <p className="text-slate-500 text-sm md:text-base">View, filter, and manage your invoices</p>
                </div>

                <button id="createInvoiceBtn" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                    <i className="fa-solid fa-plus mr-2"></i> Create New Invoice
                </button>
            </header>
            <RecentInvoices />
        </main>
    )
}

export default AllInvoices