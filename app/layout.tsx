import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShopProfileProvider } from '@/contexts/ShopProfileContext';
import { DynamicHead } from '@/components/DynamicHead';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "GST Invoice Generator",
    description: "Professional GST invoice generator for businesses",
    keywords: ["invoice", "GST", "business", "tax"],
    icons: {
        icon: "/jw_logo.png",
        shortcut: "/jw_logo.png",
        apple: "/jw_logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ShopProfileProvider>
                    <DynamicHead />
                    {children}
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
                        theme="colored"
                    />
                </ShopProfileProvider>
            </body>
        </html>
    );
}
