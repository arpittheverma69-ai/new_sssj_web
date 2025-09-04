"use client";
import { NavbarDemo } from "@/components/Navbar";
import SideItems from "@/components/side-menu/SideItems";
import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider } from 'next-auth/react';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </SessionProvider>
  );
};

export default Provider;