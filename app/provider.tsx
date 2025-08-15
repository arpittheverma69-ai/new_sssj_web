import { NavbarDemo } from "@/components/Navbar";
import React from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <NavbarDemo>
                {children}
            </NavbarDemo>
        </div>
    );
}