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

export function NavbarDemo() {
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
        <Navbar className="w-full top-0 py-3 lg:hidden">
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
    );
}