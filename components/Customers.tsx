"use client"
import React, { useState } from 'react'
import RecentInvoices from './invoice-table/RecentInvoicesTable'
import AddCustomer from './forms/AddCustomer'

const Customers = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className='w-full flex flex-col mx-auto flex-1 p-4 md:p-8'>
            <AddCustomer setOpen={setOpen} open={open} />
            <div className="flex justify-between items-center mb-4 w-[95%] m-auto">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
                    <p className="text-gray-500">Manage your customer database for invoicing.</p>
                </div>
                <button onClick={() => setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                    <i className="fa-solid fa-plus mr-2"></i> Add New Customer
                </button>
            </div>
            <RecentInvoices />
        </div>
    )
}

export default Customers