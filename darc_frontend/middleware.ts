import { NextRequest, NextResponse } from "next/server";

// Define protected routes
const protectedRoutes = [
  "/home",
  "/developer-dashboard",
  "/registerAgent",
  "/connect-wallet",
];

const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies
  const token = request.cookies.get("auth_token")?.value;

  // If user is authenticated
  if (token) {
    // Prevent authenticated users from accessing auth pages
    if (authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.next();
  }

  // If user is not authenticated
  if (protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configure which routes to apply middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
