import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  // Protect only authenticated sections. Keep '/' public.
  matcher: ["/dashboard/:path*", "/app/:path*", "/api/secure/:path*"],
};
