import { jwtDecode } from "jwt-decode";

export interface User {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "USER";
  lastLoginAt: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  sessionId: string;
  user: User;
  issuedAt: string;
  expiresAt: string;
}

export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  sessionId: string;
}

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const SESSION_ID_KEY = "session_id";
const USER_KEY = "user_data";

export class AuthManager {
  static setTokens(authData: AuthTokens) {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, authData.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
      localStorage.setItem(SESSION_ID_KEY, authData.sessionId);
      localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    }
  }

  static getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  static getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  }

  static getSessionId(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(SESSION_ID_KEY);
    }
    return null;
  }

  static getUser(): User | null {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  static clearTokens() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(SESSION_ID_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.isTokenExpired(token);
  }
}
