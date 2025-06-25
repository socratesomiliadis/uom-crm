import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookie
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "No access token found" },
        { status: 401 }
      );
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile`;

    // Forward the profile request to the backend with the token
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Profile fetch failed" }));
      return NextResponse.json(error, { status: response.status });
    }

    // Check if response is actually JSON
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      // Backend returned non-JSON response
      const textResponse = await response.text();

      return NextResponse.json(
        {
          message: "Backend returned invalid response",
          details: `Expected JSON but got: ${contentType}`,
          preview: textResponse.substring(0, 100),
        },
        { status: 502 }
      );
    }

    const profileData = await response.json();
    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Profile API error:", error);

    // Check if it's a network error (backend not running)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          message: "Backend server not reachable",
          details: "Make sure the backend is running on port 8080",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
