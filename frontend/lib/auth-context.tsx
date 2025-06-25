"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authManager, getUserInfo, logout as authLogout } from "./auth";
import { UserInfoDto } from "./api/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfoDto | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: (logoutAll?: boolean) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state on mount
    const initializeAuth = async () => {
      try {
        // Check if authenticated by making API call
        const isAuth = await authManager.isAuthenticated();

        if (isAuth) {
          // If authenticated, get user info
          try {
            const userInfo = await getUserInfo();
            if (userInfo) {
              setUser(userInfo);
              setAuthenticated(true);
            } else {
              // User info fetch failed, try to refresh token
              const isValid = await authManager.checkAndRefreshToken();
              if (isValid) {
                const refreshedUserInfo = await getUserInfo();
                setUser(refreshedUserInfo);
                setAuthenticated(!!refreshedUserInfo);
              } else {
                setUser(null);
                setAuthenticated(false);
              }
            }
          } catch (error) {
            console.error(
              "Failed to get user info during initialization:",
              error
            );

            // Check if backend is unreachable
            if (
              error instanceof Error &&
              error.message.includes("Backend server not reachable")
            ) {
              // Fallback: check if we have any auth cookies as a basic check
              const hasAuthCookies =
                document.cookie.includes("accessToken") ||
                document.cookie.includes("refreshToken");

              if (hasAuthCookies) {
                // Set a temporary user object to allow access
                setUser({
                  id: 0,
                  username: "offline-user",
                  email: "offline@example.com",
                } as any);
                setAuthenticated(true);

                // Show a warning that backend is offline
                console.warn(
                  "⚠️ Backend is offline - operating in offline mode"
                );
                return;
              }
            }

            // Try to refresh token
            try {
              const isValid = await authManager.checkAndRefreshToken();
              if (isValid) {
                const userInfo = await getUserInfo();
                setUser(userInfo);
                setAuthenticated(!!userInfo);
              } else {
                setUser(null);
                setAuthenticated(false);
              }
            } catch (refreshError) {
              console.error(
                "Token refresh failed during initialization:",
                refreshError
              );
              setUser(null);
              setAuthenticated(false);
            }
          }
        } else {
          setUser(null);
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
        setAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up token validation interval (check every 5 minutes)
    const interval = setInterval(async () => {
      try {
        const isAuth = await authManager.isAuthenticated();
        if (isAuth) {
          // Update user info in case it changed
          const userInfo = await getUserInfo();
          setUser(userInfo);
          setAuthenticated(!!userInfo);
        } else {
          // Try to refresh token
          const isValid = await authManager.checkAndRefreshToken();
          if (isValid) {
            const userInfo = await getUserInfo();
            setUser(userInfo);
            setAuthenticated(!!userInfo);
          } else {
            // Authentication failed, logout
            await handleLogout();
          }
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        await handleLogout();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const authResponse = await authManager.login({ username, password });
      setUser(authResponse.user);
      setAuthenticated(true);
    } catch (error) {
      setUser(null);
      setAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (logoutAll: boolean = false) => {
    setIsLoading(true);
    try {
      await authLogout(logoutAll);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setAuthenticated(false);
      setIsLoading(false);
      router.push("/");
    }
  };

  const refreshUser = async () => {
    try {
      const isAuth = await authManager.isAuthenticated();
      if (isAuth) {
        const userInfo = await getUserInfo();
        setUser(userInfo);
        setAuthenticated(!!userInfo);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } catch (error) {
      console.error("Failed to refresh user info:", error);
      setUser(null);
      setAuthenticated(false);
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated: authenticated && !!user,
    user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
