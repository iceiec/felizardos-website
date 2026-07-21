import { createContext, useContext, useState } from "react";

const ADMIN_EMAIL = "admin@felizardos.com";
const ADMIN_PASSWORD = "felizardos2025";
const AUTH_KEY = "felizardos_admin_auth";

interface AdminAuthCtx {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthCtx>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_KEY) === "true"
  );

  const login = (email: string, password: string): boolean => {
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
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
