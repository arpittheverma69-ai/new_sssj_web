import React from 'react'
import RecentInvoices from './invoice-table/RecentInvoicesTable'

const AllInvoices = () => {
    return (
        <div className='w-full flex flex-col flex-1 p-4 md:p-8'>
            <div className="flex justify-between items-center mb-4 w-[95%] m-auto">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">All Invoices</h1>
                    <p className="text-gray-500">View, filter, and manage your invoices</p>
                </div>
                <button id="createInvoiceBtn" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                    <i className="fa-solid fa-plus mr-2"></i> Create New Invoice
                </button>
            </div>
            <RecentInvoices />
        </div>
    )
}

export default AllInvoices