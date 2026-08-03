import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { LoginResponse } from "../types/auth";

interface AuthContextType {
  user: LoginResponse | null;
  login: (user: LoginResponse) => void;
  logout: () => void;
  isAdmin: boolean;
  isPublisher: boolean;
  isStaff: boolean; // admin OR publisher — can access the management panel
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ← KEY FIX

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const loginTimestamp = localStorage.getItem("loginTimestamp");
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    if (stored) {
      if (loginTimestamp && Date.now() - Number(loginTimestamp) > TWENTY_FOUR_HOURS) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("loginTimestamp");
        setUser(null);
      } else {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("loginTimestamp");
        }
      }
    }
    setIsLoading(false); // done checking localStorage
  }, []);

  const login = (userData: LoginResponse) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("loginTimestamp", Date.now().toString());
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTimestamp");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: user?.role === "ADMIN",
        isPublisher: user?.role === "PUBLISHER",
        isStaff: user?.role === "ADMIN" || user?.role === "PUBLISHER",
        isLoggedIn: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
