import { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";
import { getToken } from "../services/api";

const AUTH_KEY = "felizardos_admin_auth";

interface AdminAuthCtx {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthCtx>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_KEY) === "true" && !!getToken()
  );

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authService.login(email, password);
      if (res && res.token) {
        localStorage.setItem(AUTH_KEY, "true");
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
