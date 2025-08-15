import { NavbarDemo } from "@/components/Navbar";
import SideItems from "@/components/side-menu/SideItems";
import React from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full flex bg-gray-100 min-h-screen">
            <div className="w-80 max-lg:hidden relative">
                <div className="fixed top-0 w-65">
                    <SideItems />
                </div>
            </div>
            <div className="lg:w-screen w-full">
                <NavbarDemo />
                {children}
            </div>
        </div>
    );
}