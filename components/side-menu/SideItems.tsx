"use client"
import { usePathname } from "next/navigation";
import { FaCirclePlus, FaFileLines, FaGear, FaSquarePollVertical, FaUser } from "react-icons/fa6";

const SideItems = () => {
    const pathname = usePathname();
    const navItems = [
        {
            name: "Dashboard",
            link: "/",
            icon: <FaCirclePlus />
        },
        {
            name: "Create Invoice",
            link: "/create-invoice",
            icon: <FaFileLines />
        },
        {
            name: "All Invoices",
            link: "/all-invoice",
            icon: <FaUser />
        },
        {
            name: "Customers",
            link: "/customers",
            icon: <FaCirclePlus />
        },
        {
            name: "Reports",
            link: "/reports",
            icon: <FaSquarePollVertical />
        },
        {
            name: "Settings",
            link: "/setting",
            icon: <FaGear />
        },
    ];
    return (
        <div className="fixed md:relative border-r border-gray-200 transform -translate-x-full md:translate-x-0 h-screen bg-white">
            <div className="p-4 font-bold text-lg border-b border-gray-200">
                <span className="text-blue-600">🧾</span> J.V. Jewellers
                <p className="text-xs text-gray-500">GST Invoice Generator</p>
            </div>
            <nav className="flex flex-col mt-4 space-y-1 text-gray-700 px-2">
                {
                    navItems.map((item, id) => {
                        const active = pathname === item.link
                        return (
                            <a href={item.link} key={id} className={`${active ? 'bg-blue-100' : 'hover:bg-gray-100'} px-4 py-2 rounded-md flex`}>
                                <span className="">{item.icon}</span>
                                {item.name}
                            </a>
                        );
                    })
                }
            </nav>

            {/* <!-- Footer user --> */}
            <div className="absolute bottom-4 w-64 px-4 py-3 border-t border-gray-200 text-gray-600 text-sm">
                <div className="font-medium">Admin User</div>
                <div className="text-xs">admin@jvjewellers.com</div>
            </div>
        </div>
    )
}

export default SideItems