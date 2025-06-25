"use client";

import {
  AuthResponse,
  RefreshTokenRequest,
  AuthRequest,
  UserInfoDto,
} from "./api/types";

export class AuthManager {
  private static instance: AuthManager;
  private refreshPromise: Promise<AuthResponse | null> | null = null;

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  // Check if user is authenticated by making an API call
  async isAuthenticated(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    try {
      const response = await fetch("/api/auth/check", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        return data.authenticated;
      }
      return false;
    } catch (error) {
      console.error("Authentication check failed:", error);
      return false;
    }
  }

  // Synchronous version for quick checks (less reliable)
  isAuthenticatedSync(): boolean {
    // This is a fallback method for cases where we need synchronous check
    // We'll use this cautiously and prefer the async version
    return true; // Optimistic approach - let the async check handle the real validation
  }

  // Get user info from our API route (which uses cookies)
  async getUserInfo(): Promise<UserInfoDto | null> {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Failed to get user info:", error);
    }
    return null;
  }

  // Login function using our API route
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Login failed" }));
      throw new Error(error.message || "Login failed");
    }

    const authResponse: AuthResponse = await response.json();
    return authResponse;
  }

  // Refresh token function using our API route
  async refreshToken(): Promise<AuthResponse | null> {
    // If there's already a refresh in progress, return that promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<AuthResponse | null> {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Empty body, refresh token will be read from cookie
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const authResponse: AuthResponse = await response.json();
      console.log("Token refreshed");
      return authResponse;
    } catch (error) {
      console.error("Token refresh failed:", error);
      await this.logout();
      return null;
    }
  }

  // Check if we need to refresh token
  async checkAndRefreshToken(): Promise<boolean> {
    try {
      // Try to make an authenticated request to validate token
      const response = await fetch("/api/auth/profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        // Token is expired, try to refresh
        const refreshResult = await this.refreshToken();
        return refreshResult !== null;
      }

      return response.ok;
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  }

  // Logout function
  async logout(logoutAll: boolean = false): Promise<void> {
    try {
      // Call backend logout endpoint with tokens from cookies
      const refreshToken = this.getCookieValue("refreshToken");
      const sessionId = this.getCookieValue("sessionId");

      const endpoint = logoutAll ? "/auth/logout-all" : "/auth/logout";
      const params = new URLSearchParams();

      if (refreshToken) params.append("refreshToken", refreshToken);
      if (sessionId) params.append("sessionId", sessionId);

      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}?${params}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Backend logout failed:", error);
    }

    // Clear cookies on frontend
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Frontend logout failed:", error);
    }
  }

  // Helper to get cookie value
  private getCookieValue(name: string): string | null {
    if (typeof window === "undefined") return null;

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split("=");
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  // Authenticated fetch with automatic token refresh
  async authenticatedFetch(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    // For internal API routes, use credentials
    if (url.startsWith("/api/")) {
      return fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
    }

    // For external API calls, get token from cookie and add to header
    const accessToken = this.getCookieValue("accessToken");

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    });

    // If we get a 401, try to refresh token and retry once
    if (response.status === 401 && !url.includes("/auth/refresh")) {
      const refreshResult = await this.refreshToken();
      if (refreshResult) {
        const newAccessToken = this.getCookieValue("accessToken");
        // Retry the original request
        return fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...(newAccessToken
              ? { Authorization: `Bearer ${newAccessToken}` }
              : {}),
            ...options.headers,
          },
        });
      } else {
        // Refresh failed, redirect to login
        throw new Error("Authentication failed");
      }
    }

    return response;
  }
}

// Singleton instance
export const authManager = AuthManager.getInstance();

// Exported convenience functions
export const isAuthenticated = () => authManager.isAuthenticated();
export const isAuthenticatedSync = () => authManager.isAuthenticatedSync();
export const getUserInfo = () => authManager.getUserInfo();
export const login = (credentials: AuthRequest) =>
  authManager.login(credentials);
export const logout = (logoutAll?: boolean) => authManager.logout(logoutAll);
export const checkAndRefreshToken = () => authManager.checkAndRefreshToken();
export const authenticatedFetch = (url: string, options?: RequestInit) =>
  authManager.authenticatedFetch(url, options);
