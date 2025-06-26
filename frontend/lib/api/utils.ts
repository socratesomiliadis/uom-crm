import { AuthManager } from "@/lib/auth";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface JwtPayload {
  exp: number;
}

/**
 * Helper function to check if a JWT token is expired
 */
function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

interface FetchOptions extends Omit<RequestInit, "headers"> {
  headers?: HeadersInit;
}

/**
 * Client-side fetch that reads JWT from localStorage and handles token refresh
 */
export async function fetchClient<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  let accessToken = AuthManager.getAccessToken();

  // Check if token is expired and try to refresh it
  if (accessToken && AuthManager.isTokenExpired(accessToken)) {
    const refreshToken = AuthManager.getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const newAuthData = await refreshResponse.json();
          AuthManager.setTokens(newAuthData);
          accessToken = newAuthData.accessToken;
        } else {
          // Refresh failed, clear tokens
          AuthManager.clearTokens();
          throw new Error("Authentication expired. Please login again.");
        }
      } catch (error) {
        AuthManager.clearTokens();
        throw new Error("Authentication expired. Please login again.");
      }
    } else {
      throw new Error("No authentication token available.");
    }
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const err = await res?.json();
      if (err?.message) message = `${message} - ${err.message}`;
    } catch {}

    // If unauthorized and we have a token, it might be invalid
    if (res.status === 401 && accessToken) {
      AuthManager.clearTokens();
    }

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

/**
 * Server-side fetch that reads JWT from cookies and handles token refresh
 */
export async function fetchServer<T>(
  path: string,
  options: FetchOptions = {},
  tag?: string
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("access_token")?.value;

  // Check if token is expired and try to refresh it
  if (accessToken && isTokenExpired(accessToken)) {
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/api/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (refreshResponse.ok) {
          // Refresh successful, get the new access token from cookies
          const newCookieStore = await cookies();
          accessToken = newCookieStore.get("access_token")?.value;
        } else {
          // Refresh failed, token will be undefined
          accessToken = undefined;
        }
      } catch (error) {
        console.error("Server-side token refresh failed:", error);
        accessToken = undefined;
      }
    } else {
      accessToken = undefined;
    }
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
    ...(tag ? { next: { tags: [tag] } } : {}),
  });

  // If we get 401 and have a refresh token, try to refresh once more
  if ((res.status === 401 || res.status === 403) && accessToken) {
    try {
      const refreshResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (refreshResponse.ok) {
        // Refresh successful, retry the original request
        const newCookieStore = await cookies();
        const newAccessToken = newCookieStore.get("access_token")?.value;

        if (newAccessToken) {
          const retryHeaders: HeadersInit = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newAccessToken}`,
            ...options.headers,
          };

          const retryRes = await fetch(url, {
            ...options,
            headers: retryHeaders,
            credentials: "include",
            ...(tag ? { next: { tags: [tag] } } : {}),
          });

          if (retryRes.ok) {
            return retryRes.json() as Promise<T>;
          }
        }
      }
    } catch (error) {
      console.error("Server-side token refresh on 401 failed:", error);
    }
  }

  if (!res.ok) {
    let message = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const err = await res?.json();
      if (err?.message) message = `${message} - ${err.message}`;
    } catch {}
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

/**
 * Legacy fetchDirect function - will use server-side fetch if on server, client-side if on client
 */
export async function fetchDirect<T>(
  path: string,
  options: FetchOptions = {},
  tag?: string
): Promise<T> {
  // Check if we're on the server
  if (typeof window === "undefined") {
    return fetchServer<T>(path, options, tag);
  } else {
    return fetchClient<T>(path, options);
  }
}
