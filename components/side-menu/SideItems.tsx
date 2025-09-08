"use client"
import { usePathname } from "next/navigation";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRef, useState } from "react";
import analytics from "@/lib/icon-files/analytics.json"
import Individual from "@/lib/icon-files/Individual.json"
import Report from "@/lib/icon-files/Report V2.json"
import note from "@/lib/icon-files/note.json"
import plus from "@/lib/icon-files/plus.json"
import setting from "@/lib/icon-files/setting.json"
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useShopProfile } from "@/contexts/ShopProfileContext";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Image from "next/image";

const SideItems = () => {
    const pathname = usePathname();
    const { shopProfile } = useShopProfile();
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);

            // Call our custom logout API
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Sign out using NextAuth
            await signOut({
                redirect: false,
            });

            // Redirect to home page
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

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
        // {
        //     name: "Reports",
        //     link: "/dashboard/reports",
        //     icon: Report
        // },
        {
            name: "Settings",
            link: "/dashboard/setting",
            icon: setting
        },
    ];
    return (
        <div className="fixed md:relative border-r border-border transform -translate-x-full md:translate-x-0 h-screen bg-card shadow-xl">
            <div className="px-2 py-4 border-b border-border bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary rounded-[24px] flex items-center justify-center">
                            <Image
                                src={'/jw_logo.png'}
                                alt="Jewellers Logo"
                                width={60}
                                height={60}
                            />
                        </div>
                        <div>
                            <h1 className="font-bold text-md text-foreground">{shopProfile.shopName}</h1>
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
                                className={`${active
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

            {/* Footer user with logout */}
            <div className="absolute bottom-6 left-3 right-3">
                <div className="bg-accent/50 backdrop-blur-sm rounded-[24px] p-4 border border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary text-lg">👤</span>
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-foreground">
                                {session?.user?.name || 'Admin User'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {session?.user?.email || 'admin@jvjewellers.com'}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors duration-200 group"
                            title="Logout"
                        >
                            <LogOut className={`w-4 h-4 text-red-600 dark:text-red-400 ${isLoggingOut ? 'animate-spin' : 'group-hover:scale-110'} transition-transform duration-200`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideItems