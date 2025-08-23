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
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const SideItems = () => {
    const pathname = usePathname();
    const navItems = [
        {
            name: "Dashboard",
            link: "/dashboard",
            icon: analytics
        },
        {
            name: "Create Invoice",
            link: "/dashboard/create-invoice",
            icon: plus
        },
        {
            name: "All Invoices",
            link: "/dashboard/all-invoice",
            icon: note
        },
        {
            name: "Customers",
            link: "/dashboard/customers",
            icon: Individual
        },
        {
            name: "Reports",
            link: "/dashboard/reports",
            icon: Report
        },
        {
            name: "Settings",
            link: "/dashboard/setting",
            icon: setting
        },
    ];
    return (
        <div className="fixed md:relative border-r border-border transform -translate-x-full md:translate-x-0 h-screen bg-card shadow-xl">
            <div className="p-6 border-b border-border bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-[24px] flex items-center justify-center text-white text-xl font-bold">
                            🧾
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-foreground">J.V. Jewellers</h1>
                            <p className="text-xs text-muted-foreground">GST Invoice Generator</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
            <nav className="flex flex-col mt-6 space-y-2 text-foreground px-3">
                {
                    navItems.map((item, id) => {
                        const lottieRef = useRef<LottieRefCurrentProps>(null);
                        const active = pathname === item.link
                        return (
                            <Link 
                                href={item.link} 
                                key={id} 
                                className={`${
                                    active 
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                                        : 'hover:bg-accent hover:text-accent-foreground'
                                } px-4 py-3 rounded-[24px] flex items-center transition-all duration-200 group`}
                                onMouseEnter={() => lottieRef.current?.play()}
                                onMouseLeave={() => lottieRef.current?.stop()}
                            >
                                <div className="w-8 h-8 cursor-pointer mr-3 transition-transform duration-200 group-hover:scale-110">
                                    <Lottie
                                        lottieRef={lottieRef}
                                        animationData={item.icon}
                                        loop={false}
                                        autoplay={false}
                                    />
                                </div>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })
                }
            </nav>

            {/* Footer user */}
            <div className="absolute bottom-6 left-3 right-3">
                <div className="bg-accent/50 backdrop-blur-sm rounded-[24px] p-4 border border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary text-lg">👤</span>
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-foreground">Admin User</div>
                            <div className="text-xs text-muted-foreground">admin@jvjewellers.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideItems