import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Owner credentials - Change these to your actual admin credentials
const OWNER_EMAIL = "admin@studymateai.com";
const OWNER_PASSWORD = "admin123"; // Change this to a secure password

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Only the owner can access admin panel
        if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
          const token = `admin-token-${Date.now()}-${Math.random()}`;
          localStorage.setItem("adminToken", token);
          localStorage.setItem("adminLoginTime", new Date().toISOString());
          setIsAuthenticated(true);
          resolve(true);
        } else {
          setIsAuthenticated(false);
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoginTime");
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
