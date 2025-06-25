import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookie
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate`;

    // Check token validity with backend
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const authenticated = response.ok;

    return NextResponse.json({ authenticated }, { status: 200 });
  } catch (error) {
    console.error("Auth check API error:", error);

    // If backend is not reachable, assume not authenticated
    if (
      error instanceof TypeError &&
      (error as Error).message.includes("fetch")
    ) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
