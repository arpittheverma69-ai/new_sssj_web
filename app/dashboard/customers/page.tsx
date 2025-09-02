import Customers from '@/components/Customers'
import React from 'react'

const page = () => {
    return (

        <div className='w-full flex flex-col mx-auto flex-1 p-6 md:p-8 max-sm:pt-26'>
            <Customers />
        </div>
    )
}

export default page