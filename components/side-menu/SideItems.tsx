import React from 'react'
const SideItems = () => {
    const navItems = [
        {
            name: "Dashboard",
            link: "./",
        },
        {
            name: "Create Invoice",
            link: "./create-invoice",
        },
        {
            name: "All Invoices",
            link: "./all-invoice",
        },
        {
            name: "Customers",
            link: "./customers",
        },
        {
            name: "Reports",
            link: "./reports",
        },
        {
            name: "Settings",
            link: "./setting",
        },
    ];
    return (
        <div className="fixed md:relative border-r transform -translate-x-full md:translate-x-0 h-screen">
            <div className="p-4 font-bold text-lg border-b">
                <span className="text-blue-600">🧾</span> J.V. Jewellers
                <p className="text-xs text-gray-500">GST Invoice Generator</p>
            </div>
            <nav className="flex flex-col mt-4 space-y-1 text-gray-700">
                {
                    navItems.map((item, id) => (
                        <a href={item.link} className="px-4 py-2 hover:bg-gray-100">{item.name}</a>
                    ))
                }
            </nav>

            {/* <!-- Footer user --> */}
            <div className="absolute bottom-4 w-64 px-4 py-3 border-t text-gray-600 text-sm">
                <div className="font-medium">Admin User</div>
                <div className="text-xs">admin@jvjewellers.com</div>
            </div>
        </div>
    )
}

export default SideItems