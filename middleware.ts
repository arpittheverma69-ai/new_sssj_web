import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Check if session has expired (1 week = 604800000 ms)
    if (token?.loginTime && Date.now() - Number(token.loginTime) > 604800000) {
      // Session expired, redirect to login
      return NextResponse.redirect(new URL('/?message=session-expired', req.url));
    }

    // Add any additional middleware logic here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Check if token exists and is not expired
        if (!token) return false;

        // Check session expiry
        if (token.loginTime && Date.now() - Number(token.loginTime) > 604800000) {
          return false;
        }

        return true;
      },
    },
  }
);

export const config = {
  // Protect only authenticated sections. Keep '/' public.
  matcher: ["/dashboard/:path*", "/app/:path*", "/api/secure/:path*"],
};
