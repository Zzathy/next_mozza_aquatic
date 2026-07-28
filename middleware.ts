import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/dashboard/laporan") && token?.role === "Pegawai") {
      return NextResponse.redirect(new URL("/dashboard/kasir", req.url));
    }

    if (path.startsWith("/dashboard/settings") && token?.role !== "Superadmin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, 
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*", 
    
    "/api/dashboard/:path*",
    "/api/products/:path*",
    "/api/damage-logs/:path*"
  ],
};