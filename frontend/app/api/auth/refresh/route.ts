import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token available" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Clear cookies if refresh failed
      cookieStore.delete("access_token");
      cookieStore.delete("refresh_token");
      cookieStore.delete("session_id");

      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "Token refresh failed" },
        { status: response.status }
      );
    }

    const authData = await response.json();

    // Update cookies with new tokens
    cookieStore.set("access_token", authData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: authData.expiresIn || 3600, // 1 hour default
      path: "/",
    });

    cookieStore.set("refresh_token", authData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    cookieStore.set("session_id", authData.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Return auth data (without sensitive tokens for client storage)
    return NextResponse.json({
      ...authData,
      // Don't send actual tokens to client for security
      refreshToken: "set-in-cookie",
    });
  } catch (error) {
    console.error("Refresh token API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
