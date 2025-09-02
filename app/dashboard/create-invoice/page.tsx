import CreateInvoice from '@/components/create-invoice-pages/CreateInvoice'
import React from 'react'

const page = () => {
    return (

        <div className='w-full flex flex-col mx-auto flex-1 p-6 md:p-8 max-sm:pt-26'>
            <CreateInvoice />
        </div>
    )
}

export default page