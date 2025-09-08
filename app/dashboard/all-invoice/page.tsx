import AllInvoices from '@/components/AllInvoices'
import React from 'react'

const page = () => {
    return (

        <div className='w-full flex flex-col mx-auto flex-1 p-2 md:p-8 max-sm:pt-26'>
            <AllInvoices />
        </div>
    )
}

export default page