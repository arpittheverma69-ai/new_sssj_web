"use client"
import React, { useState } from 'react'
import RecentInvoices from './invoice-table/InvoicesTable'
import AddCustomer from './forms/AddCustomer'

const Customers = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className='w-full flex flex-col mx-auto flex-1 p-4 md:p-8'>
            <AddCustomer setOpen={setOpen} open={open} />
            <header className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Customers</h2>
                    <p className="text-slate-500 text-sm md:text-base">Manage your customer database for invoicing.</p>
                </div>
                <button onClick={() => setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                    <i className="fa-solid fa-plus mr-2"></i> Add New Customer
                </button>
            </header>
            <RecentInvoices />
        </div>
    )
}

export default Customers