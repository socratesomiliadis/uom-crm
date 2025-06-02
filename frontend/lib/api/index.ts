import { cookies } from "next/headers";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

/**
 * Reads JWT from cookie, attaches Authorization header.
 * Returns a typed Promise<T>.
 */
export async function fetchDirect<T>(
  path: string,
  options: Omit<RequestInit, "headers"> & { headers?: HeadersInit } = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  // Next.js Server Component helper to read cookies
  const cookieStore = await cookies();
  const jwt = cookieStore.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!)?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // allow cookies if backend sets some
  });
  if (!res.ok) {
    let message = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const err = await res.json();
      if (err?.message) message = err.message;
    } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

/**
 * Client-side fetch (Client Component).
 * Reads JWT from localStorage, attaches Authorization.
 */
export async function fetchClient<T>(
  path: string,
  options: Omit<RequestInit, "headers"> & { headers?: HeadersInit } = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!)
      : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      const err = await res.json();
      if (err?.message) message = err.message;
    } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}
