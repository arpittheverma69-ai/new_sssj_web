"use client"
import { usePathname } from "next/navigation";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRef } from "react";
import analytics from "@/lib/icon-files/analytics.json"
import Individual from "@/lib/icon-files/Individual.json"
import Report from "@/lib/icon-files/Report V2.json"
import note from "@/lib/icon-files/note.json"
import plus from "@/lib/icon-files/plus.json"
import setting from "@/lib/icon-files/setting.json"
import Link from "next/link";

const SideItems = () => {
    const pathname = usePathname();
    const navItems = [
        {
            name: "Dashboard",
            link: "/",
            icon: analytics
        },
        {
            name: "Create Invoice",
            link: "/create-invoice",
            icon: plus
        },
        {
            name: "All Invoices",
            link: "/all-invoice",
            icon: note
        },
        {
            name: "Customers",
            link: "/customers",
            icon: Individual
        },
        {
            name: "Reports",
            link: "/reports",
            icon: Report
        },
        {
            name: "Settings",
            link: "/setting",
            icon: setting
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
                        const lottieRef = useRef<LottieRefCurrentProps>(null);
                        const active = pathname === item.link
                        return (
                            <Link href={item.link} key={id} className={`${active ? 'bg-blue-100' : 'hover:bg-gray-100'} px-4 py-2 rounded-md flex items-center`}
                                onMouseEnter={() => lottieRef.current?.play()}
                                onMouseLeave={() => lottieRef.current?.stop()}
                            >
                                <div className="w-7 h-7 cursor-pointer mr-2">
                                    <Lottie
                                        lottieRef={lottieRef}
                                        animationData={item.icon}
                                        loop={false}
                                        autoplay={false}
                                    />
                                </div>
                                {item.name}
                            </Link>
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