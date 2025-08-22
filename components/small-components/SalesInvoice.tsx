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
            bgColor: 'bg-blue-500/10',
            textColor: 'text-blue-500',
            borderColor: 'border-blue-500/20'
        },
        {
            title: 'Tax Collected',
            value: '₹0',
            change: '8.3%',
            isPositive: true,
            icon: <span className="font-bold text-lg md:text-xl">%</span>,
            bgColor: 'bg-purple-500/10',
            textColor: 'text-purple-500',
            borderColor: 'border-purple-500/20'
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
            bgColor: 'bg-yellow-500/10',
            textColor: 'text-yellow-500',
            borderColor: 'border-yellow-500/20'
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
            bgColor: 'bg-green-500/10',
            textColor: 'text-green-500',
            borderColor: 'border-green-500/20'
        }
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
                <div 
                    key={index} 
                    className="group relative bg-card p-6 rounded-[24px] shadow-lg shadow-black/5 border border-border hover:shadow-xl hover:shadow-black/10 transition-all duration-300 hover:-translate-y-1"
                >
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 ${card.bgColor} rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-4">
                        <div className={`${card.bgColor} ${card.textColor} w-12 h-12 md:w-14 md:h-14 rounded-[20px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                            {card.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-muted-foreground text-sm font-medium mb-1">{card.title}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-3xl font-bold text-foreground">{card.value}</span>
                                <span className={`text-sm ${card.isPositive ? 'text-green-500' : 'text-red-500'} font-semibold flex items-center gap-1`}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d={card.isPositive ? "M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H5a1 1 0 110-2h2v-1H5a1 1 0 110-2h2V8H5a1 1 0 010-2h2V5a1 1 0 112 0v1h2a1 1 0 011 1z" : "M12 13a1 1 0 100-2H9v-1h2a1 1 0 100-2H9V7a1 1 0 112 0v1h2a1 1 0 110 2h-2v1h2a1 1 0 110 2h-2v1a1 1 0 11-2 0v-1H9a1 1 0 110-2h2v-1H9z"} clipRule="evenodd" />
                                    </svg> 
                                    {card.change}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Border accent */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${card.borderColor} rounded-b-[24px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>
            ))}
        </div>
    )
}

export default SalesInvoice