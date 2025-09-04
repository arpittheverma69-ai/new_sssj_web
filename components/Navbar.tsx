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
import { Menu, X } from "lucide-react";
import { useShopProfile } from "@/contexts/ShopProfileContext";
import Image from "next/image";

export function NavbarDemo() {
    const { shopProfile } = useShopProfile()
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
                        <div className="w-8 h-8 bg-primary rounded-[20px] flex items-center justify-center text-white text-sm font-bold">
                            <Image
                                src={'/jw_logo.png'}
                                alt="Jewellers Logo"
                                width={24}
                                height={24}
                            />
                        </div>
                        <div>
                            <div className="font-bold text-sm text-foreground">{shopProfile.shopName}</div>
                            <div className="text-xs text-muted-foreground">GST Invoice Generator</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
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
                    </div>
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
}