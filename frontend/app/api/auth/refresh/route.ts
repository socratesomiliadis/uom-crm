import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token found" },
        { status: 401 }
      );
    }

    // Forward the refresh request to the backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Token refresh failed" }));

      // If refresh failed, clear cookies
      const nextResponse = NextResponse.json(error, {
        status: response.status,
      });
      nextResponse.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
      nextResponse.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
      nextResponse.cookies.set("sessionId", "", { maxAge: 0, path: "/" });

      return nextResponse;
    }

    const authData = await response.json();

    // Create response with the auth data
    const nextResponse = NextResponse.json(authData);

    // Update JWT tokens in cookies
    if (authData.accessToken) {
      nextResponse.cookies.set("accessToken", authData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60, // 24 hours
      });
    }

    if (authData.refreshToken) {
      nextResponse.cookies.set("refreshToken", authData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    if (authData.sessionId) {
      nextResponse.cookies.set("sessionId", authData.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Refresh API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
