import React from 'react'

const SalesInvoice = () => {
    // Stat Cards Data
    const statCards = [
        {
            title: 'Total Sales',
            value: '₹0',
            change: '12.5%',
            isPositive: true,
            icon: (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
            ),
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-500'
        },
        {
            title: 'Tax Collected',
            value: '₹0',
            change: '8.3%',
            isPositive: true,
            icon: <span className="font-bold text-lg md:text-xl">%</span>,
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-500'
        },
        {
            title: 'Invoices Generated',
            value: '0',
            change: '5.2%',
            isPositive: true,
            icon: (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
            ),
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-500'
        },
        {
            title: 'Avg. Invoice Value',
            value: '₹0',
            change: '2.1%',
            isPositive: false,
            icon: (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
            ),
            bgColor: 'bg-green-100',
            textColor: 'text-green-500'
        }
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {statCards.map((card, index) => (
                <div key={index} className="bg-white p-4 md:p-5 rounded-lg shadow-sm flex items-center gap-3 md:gap-5">
                    <div className={`${card.bgColor} ${card.textColor} w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center`}>
                        {card.icon}
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs md:text-sm">{card.title}</p>
                        <div className="flex items-baseline">
                            <span className="text-xl md:text-2xl font-bold text-slate-800">{card.value}</span>
                            <span className={`text-xs md:text-sm ${card.isPositive ? 'text-green-500' : 'text-red-500'} font-semibold ml-2`}>
                                <svg className="w-3 h-3 inline" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d={card.isPositive ? "M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H5a1 1 0 110-2h2v-1H5a1 1 0 110-2h2V8H5a1 1 0 010-2h2V5a1 1 0 112 0v1h2a1 1 0 011 1z" : "M12 13a1 1 0 100-2H9v-1h2a1 1 0 100-2H9V7a1 1 0 112 0v1h2a1 1 0 110 2h-2v1h2a1 1 0 110 2h-2v1a1 1 0 11-2 0v-1H9a1 1 0 110-2h2v-1H9z"} clipRule="evenodd" />
                                </svg> {card.change}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SalesInvoice