import React, { createContext, useContext, useState, useEffect } from "react";

interface Plan {
  name: string;
  price: number; // USD
  expiresAt?: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  plan?: Plan;
}

type Feature = "transcription" | "ai_analysis" | "large_upload";

interface UserAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  purchasePlan: (planName: string, price: number, months?: number) => void;
  canUseFeature: (feature: Feature) => boolean;
  canUploadSize: (sizeBytes: number) => boolean;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("userAuth");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("userAuth");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Client-side validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Simulate login (no backend). Default to free plan if none provided.
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name: email.split("@")[0],
      email,
      plan: { name: "free", price: 0, expiresAt: null },
    };

    setUser(newUser);
    localStorage.setItem("userAuth", JSON.stringify(newUser));
  };

  const signup = async (name: string, email: string, password: string) => {
    // Client-side validation
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    if (!email.includes("@")) {
      throw new Error("Invalid email address");
    }

    // Simulate signup (no backend) and assign free plan by default.
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name,
      email,
      plan: { name: "free", price: 0, expiresAt: null },
    };

    setUser(newUser);
    localStorage.setItem("userAuth", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userAuth");
  };

  // Simulate purchasing a plan (client-side only)
  const purchasePlan = (planName: string, price: number, months = 1) => {
    if (!user) return;
    const expires = new Date();
    expires.setMonth(expires.getMonth() + months);
    const updated: User = {
      ...user,
      plan: { name: planName, price, expiresAt: expires.toISOString() },
    };
    setUser(updated);
    localStorage.setItem("userAuth", JSON.stringify(updated));
  };

  // Feature gating rules based on plan
  const canUseFeature = (feature: Feature): boolean => {
    const plan = user?.plan?.name || "free";
    switch (feature) {
      case "transcription":
        return plan === "basic" || plan === "pro";
      case "ai_analysis":
        return plan === "basic" || plan === "pro";
      case "large_upload":
        return plan === "pro" || plan === "basic";
      default:
        return false;
    }
  };

  const canUploadSize = (sizeBytes: number): boolean => {
    // free: 5MB, basic: 50MB, pro: 500MB
    const plan = user?.plan?.name || "free";
    const mb = sizeBytes / 1024 / 1024;
    if (plan === "pro") return mb <= 500;
    if (plan === "basic") return mb <= 50;
    return mb <= 5;
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        purchasePlan,
        canUseFeature,
        canUploadSize,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error("useUserAuth must be used within UserAuthProvider");
  }
  return context;
};
