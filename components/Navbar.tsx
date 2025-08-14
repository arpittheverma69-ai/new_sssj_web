"use client";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/Resizable-navbar";
import React, { ReactNode, useState } from "react";
import SideItems from "./side-menu/SideItems";

export function NavbarDemo({ children }: { children: React.ReactNode }) {
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

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="relative w-full h-screen flex">
            <div className="w-80 max-lg:hidden relative">
                <div className="fixed top-0 w-65">
                    <SideItems />
                </div>
            </div>
            <div className="w-full">
                <Navbar className="w-full top-0 py-3">
                    {/* Desktop Navigation */}
                    <NavBody>
                        <NavbarLogo />
                    </NavBody>

                    {/* Mobile Navigation */}
                    <MobileNav>
                        <MobileNavHeader>
                            <NavbarLogo />
                            <MobileNavToggle
                                isOpen={isMobileMenuOpen}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            />
                        </MobileNavHeader>

                        <MobileNavMenu
                            isOpen={isMobileMenuOpen}
                            onClose={() => setIsMobileMenuOpen(false)}
                        >
                            {navItems.map((item, idx) => (
                                <a
                                    key={`mobile-link-${idx}`}
                                    href={item.link}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="relative text-neutral-600 dark:text-neutral-300"
                                >
                                    <span className="block">{item.name}</span>
                                </a>
                            ))}
                        </MobileNavMenu>
                    </MobileNav>
                </Navbar>
                {children}
            </div>
        </div>
    );
}