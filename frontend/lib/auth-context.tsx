"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthManager, User, AuthTokens } from "./auth";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isAuthenticated = !!user && AuthManager.isAuthenticated();

  // Listen for storage changes (when tokens are updated in another tab)
  //   useEffect(() => {
  //     const handleStorageChange = (e: StorageEvent) => {
  //       if (e.key === "user_data") {
  //         if (e.newValue) {
  //           try {
  //             const userData = JSON.parse(e.newValue);
  //             setUser(userData);
  //           } catch (error) {
  //             console.error("Failed to parse user data from storage:", error);
  //           }
  //         } else {
  //           // User data was cleared
  //           setUser(null);
  //         }
  //       }
  //     };

  //     window.addEventListener("storage", handleStorageChange);
  //     return () => window.removeEventListener("storage", handleStorageChange);
  //   }, []);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const storedUser = AuthManager.getUser();
        const token = AuthManager.getAccessToken();

        if (storedUser && token && !AuthManager.isTokenExpired(token)) {
          setUser(storedUser);
        } else if (token && AuthManager.isTokenExpired(token)) {
          // Try to refresh the token
          const refreshed = await refreshToken();
          if (!refreshed) {
            AuthManager.clearTokens();
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        AuthManager.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Add periodic token expiration check
  useEffect(() => {
    if (!user) return;

    const checkTokenExpiration = async () => {
      const token = AuthManager.getAccessToken();
      if (token && AuthManager.isTokenExpired(token)) {
        console.log("Token expired, attempting to refresh...");
        const refreshed = await refreshToken();
        if (!refreshed) {
          console.log("Token refresh failed, logging out user");
          AuthManager.clearTokens();
          setUser(null);
        }
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkTokenExpiration, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      // Use Next.js API route which handles cookies
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      const authData: AuthTokens = await response.json();
      // Store client-side tokens for immediate access
      AuthManager.setTokens(authData);
      setUser(authData.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      // Use Next.js API route
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration failed");
      }

      // Registration successful - no need to set tokens, user needs to login
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Use Next.js API route which handles cookies
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      AuthManager.clearTokens();
      setUser(null);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      // Use Next.js API route which handles cookies
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return false;
      }

      const authData: AuthTokens = await response.json();
      AuthManager.setTokens(authData);
      setUser(authData.user);
      router.refresh();
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
