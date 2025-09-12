import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ShopProfileProvider } from '@/contexts/ShopProfileContext';
import { DynamicHead } from '@/components/DynamicHead';
import ToastProvider from '@/components/ToastProvider';

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
                    <ToastProvider />
                </ShopProfileProvider>
            </body>
        </html>
    );
}
