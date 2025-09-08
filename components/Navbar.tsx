"use client";
import {
    Navbar,
    NavBody,
    MobileNav,
    NavbarLogo,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/Resizable-navbar";
import React, { useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, X, LogOut } from "lucide-react";
import { useShopProfile } from "@/contexts/ShopProfileContext";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function NavbarDemo() {
    const { shopProfile } = useShopProfile();
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const navItems = [
        {
            name: "Dashboard",
            link: "/dashboard",
        },
        {
            name: "Create Invoice",
            link: "/dashboard/create-invoice",
        },
        {
            name: "All Invoices",
            link: "/dashboard/all-invoice",
        },
        {
            name: "Customers",
            link: "/dashboard/customers",
        },
        // {
        //     name: "Reports",
        //     link: "/dashboard/reports",
        // },
        {
            name: "Settings",
            link: "/dashboard/setting",
        },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    return (
        <Navbar className="w-full top-0 py-4 lg:hidden bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
            {/* Desktop Navigation */}
            <NavBody>
                <NavbarLogo />
            </NavBody>

            {/* Mobile Navigation */}
            <MobileNav>
                <MobileNavHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-[20px] flex items-center justify-center text-white text-sm font-bold">
                            <Image
                                src={'/jw_logo.png'}
                                alt="Jewellers Logo"
                                width={50}
                                height={50}
                            />
                        </div>
                        <div>
                            <div className="font-bold text-sm text-foreground">{shopProfile.shopName}</div>
                            <div className="text-xs text-muted-foreground">GST Invoice Generator</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {session && (
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="p-2 rounded-[16px] bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors duration-200 group"
                                title="Logout"
                            >
                                <LogOut className={`w-5 h-5 text-red-600 dark:text-red-400 ${isLoggingOut ? 'animate-spin' : 'group-hover:scale-110'} transition-transform duration-200`} />
                            </button>
                        )}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-[16px] bg-muted hover:bg-accent transition-colors duration-200"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-foreground" />
                            ) : (
                                <Menu className="w-5 h-5 text-foreground" />
                            )}
                        </button>
                    </div>
                </MobileNavHeader>

                <MobileNavMenu
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                >
                    <div className="space-y-2 p-4">
                        {navItems.map((item, idx) => (
                            <a
                                key={`mobile-link-${idx}`}
                                href={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 rounded-[20px] text-black hover:bg-accent transition-all duration-200 font-medium"
                            >
                                {item.name}
                            </a>
                        ))}
                        {session && (
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                disabled={isLoggingOut}
                                className="w-full text-left px-4 py-3 rounded-[20px] text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200 font-medium flex items-center gap-2"
                            >
                                <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </button>
                        )}
                    </div>
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
}