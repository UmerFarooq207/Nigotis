import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req) {
  const cookie = req.cookies.get("user")?.value;

  if (!cookie) {
    console.log("User cookie not found");
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  const path = req.nextUrl.pathname;
  const user = JSON.parse(cookie);
  const role = user?.role;
  if (path.startsWith("/super-admin") && role !== "super-admin") {
    return NextResponse.redirect(new URL(`/`, req.url));
  }
  if (role === "super-admin") {
    if (path.startsWith("/super-admin")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL(`/super-admin`, req.url));
    }
  }

  if (!user?.isVerified && !path.startsWith("/auth/verify-email")) {
    console.log("User is not verified, redirecting to verify email page");

    return NextResponse.redirect(
      new URL(
        `/auth/verify-email?email=${user?.email}&userId=${user?.userId}`,
        req.url
      )
    );
  }
  // else if (!user?.subscriptionId && user?.isBuyer && user?.allowedFreeInvoices === 0) {
  //   //
  //   return NextResponse.redirect(new URL(`/pricing`, req.url));
  // }
  else {
    if (user?.role === "employee") {
      return NextResponse.redirect(new URL(`/`, req.url));
    }
  }
  

  if (path.startsWith("/dashboard") && path !== "/dashboard/settings"&& path !== "/dashboard/support" && path !== "/dashboard/subscription") {
    // checking of company does not exist ask them to create the company first
    
    if (user?.companyId === undefined) {      
      return NextResponse.redirect(new URL(`/dashboard/settings`, req.url));
    }
  }

  if (path === "/dashboard") {
    return NextResponse.next();
  }

  // Access control for roles
  if (path.startsWith("/dashboard")) {
    // Admin can access all dashboard pages
    if (role === "admin") {
      return NextResponse.next();
    }

    // Role-specific path validation
    const rolePaths = {
      sales: [
        "/dashboard/invoices",
        "/dashboard/company",
        "/dashboard/clients",
        "/dashboard/profile",
        "/dashboard/products",
        "/dashboard/support",
      ],
      hr: [
        "/dashboard/payrolls",
        "/dashboard/employees",
        "/dashboard/profile",
        "/dashboard/support",
      ],
      finance: [
        "/dashboard/reports",
        "/dashboard/income",
        "/dashboard/expenses",
        "/dashboard/profile",
        "/dashboard/assets",
        "/dashboard/support",
      ],
    };

    const allowedPaths = rolePaths[role] || [];

    // Allow access if the requested path matches the allowed paths for the role
    if (allowedPaths.some((allowedPath) => path.startsWith(allowedPath))) {
      return NextResponse.next();
    }

    // Redirect to /dashboard if the role does not have permission
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/super-admin/:path*",
    "/api/auth/logout",
    "/auth/verify-email",
    "/pricing/buy-subscription",
  ],
};
