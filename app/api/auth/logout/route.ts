import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Clear the session cookie by setting it to expire
        const response = NextResponse.json(
            { message: "Logged out successfully" },
            { status: 200 }
        );

        // Clear NextAuth session cookies
        response.cookies.set("next-auth.session-token", "", {
            expires: new Date(0),
            path: "/",
        });

        response.cookies.set("__Secure-next-auth.session-token", "", {
            expires: new Date(0),
            path: "/",
            secure: true,
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
