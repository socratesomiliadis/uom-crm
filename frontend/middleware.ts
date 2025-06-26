import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  sessionId: string;
}

// Protected routes that require authentication
const protectedPaths = ["/dashboard"];

// Public routes that should redirect to dashboard if authenticated
const publicPaths = ["/", "/register"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedPath = protectedPaths.some((protectedPath) =>
    path.startsWith(protectedPath)
  );
  const isPublicPath = publicPaths.includes(path);

  // Get tokens from cookies
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Check if user is authenticated
  let isAuthenticated = false;
  if (accessToken) {
    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      const currentTime = Date.now() / 1000;
      isAuthenticated = decoded.exp > currentTime;
    } catch {
      isAuthenticated = false;
    }
  }

  // Handle protected routes
  if (isProtectedPath && !isAuthenticated) {
    // If no refresh token either, redirect to login
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If we have a refresh token but expired access token,
    // let the client handle the refresh
    // For now, we'll allow the request to proceed and let client-side handle it
  }

  // Handle public routes when authenticated
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
