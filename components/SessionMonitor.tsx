"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SessionMonitor() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Still loading

        // Check if session exists and has loginTime
        if (session?.user?.loginTime) {
            const loginTime = session.user.loginTime as number;
            const currentTime = Date.now();
            const sessionDuration = currentTime - loginTime;
            const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

            // If session has expired (more than 1 week old)
            if (sessionDuration > oneWeekInMs) {
                handleAutoLogout();
                return;
            }

            // Set up a timer to automatically logout when session expires
            const timeUntilExpiry = oneWeekInMs - sessionDuration;
            const logoutTimer = setTimeout(() => {
                handleAutoLogout();
            }, timeUntilExpiry);

            return () => clearTimeout(logoutTimer);
        }
    }, [session, status]);

    const handleAutoLogout = async () => {
        try {
            // Call our custom logout API
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Sign out using NextAuth
            await signOut({
                redirect: false,
            });

            // Redirect to home page with a message
            router.push('/?message=session-expired');
        } catch (error) {
            console.error('Auto-logout error:', error);
            // Fallback: force redirect to home
            router.push('/');
        }
    };

    return null; // This component doesn't render anything
}
