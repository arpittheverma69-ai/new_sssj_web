"use client";
import { NavbarDemo } from "@/components/Navbar";
import SideItems from "@/components/side-menu/SideItems";
import { SessionMonitor } from "@/components/SessionMonitor";
import React from "react";
import { SessionProvider } from 'next-auth/react';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <SessionMonitor />
      <div className="relative w-full flex bg-background min-h-screen">

        <div className="w-80 max-lg:hidden relative">
          <div className="fixed top-0 w-78">
            <SideItems />
          </div>
        </div>

        <div className="flex-1 flex flex-col w-full">
          <NavbarDemo />
          {children}
        </div>
      </div>
    </SessionProvider>
  );
};

export default Provider;