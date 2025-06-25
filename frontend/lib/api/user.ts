"use server";

import { cookies } from "next/headers";

export async function logout() {
  const cookieStore = await cookies();

  // Clear all JWT-related cookies
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("sessionId");
}

export async function serverLogout() {
  const cookieStore = await cookies();

  // Clear all JWT-related cookies
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("sessionId");
}
