import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role;

    if (role === "Pegawai") {
      const isAllowed =
        path.startsWith("/dashboard/kasir") ||
        path.startsWith("/dashboard/penjualan") ||
        path.startsWith("/dashboard/kerusakan");
      path === "/dashboard";

      if (!isAllowed) {
        return NextResponse.redirect(new URL("/dashboard/kasir", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
