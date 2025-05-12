import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  
  const isLoginPage = request.nextUrl.pathname === "/";


  if (!token) {
    // Not logged in: allow login page, block other routes
    if (!isLoginPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  try {


    if (isLoginPage) {
      // Already logged in and on login page — redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next(); // Valid token — allow access
  } catch (e) {
    // Invalid or expired token — redirect to login
    return NextResponse.redirect(new URL("/", request.url));
    
  }
}


export const config = {
    matcher: [
      "/dashboard/:path*",
      "/other-protected-route",
      "/" // login page itself (GET only)
    ],
  };
