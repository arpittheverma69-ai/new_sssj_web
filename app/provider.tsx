import { NavbarDemo } from "@/components/Navbar";
import SideItems from "@/components/side-menu/SideItems";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full flex bg-background min-h-screen">
            <div className="w-80 max-lg:hidden relative">
                <div className="fixed top-0 w-65">
                    <SideItems />
                </div>
            </div>
            <div className="lg:w-screen w-full max-lg:mt-16">
                <NavbarDemo />
                {children}
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}