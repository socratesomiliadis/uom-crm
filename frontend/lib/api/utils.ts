import { cookies } from "next/headers";
import { authenticatedFetch } from "../auth";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

/**
 * Server-side fetch that reads JWT from cookie, attaches Authorization header.
 * Returns a typed Promise<T>.
 */
export async function fetchDirect<T>(
  path: string,
  options: Omit<RequestInit, "headers"> & { headers?: HeadersInit } = {},
  tag?: string
): Promise<T> {
  const url = `${API_BASE}${path}`;
  // Next.js Server Component helper to read cookies
  const cookieStore = await cookies();
  const jwt = cookieStore.get("accessToken")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // include cookies
    ...(tag ? { next: { tags: [tag] } } : {}),
  });
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
 * Client-side fetch that uses the new cookie-based authentication system with automatic token refresh.
 * Returns a typed Promise<T>.
 */
export async function fetchAuthenticated<T>(
  path: string,
  options: Omit<RequestInit, "headers"> & { headers?: HeadersInit } = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await authenticatedFetch(url, {
    ...options,
    headers,
    credentials: "include", // include cookies
  });

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
 * Public fetch for endpoints that don't require authentication
 */
export async function fetchPublic<T>(
  path: string,
  options: Omit<RequestInit, "headers"> & { headers?: HeadersInit } = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // include cookies
  });

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
