import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("aegis_token") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("aegis_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default fallback analyst profile for development continuity
    return {
      username: "admin",
      email: "admin@aegis-iiot.sec",
      role: "ADMIN",
    };
  });
  const [permissions, setPermissions] = useState({
    can_manage_users: true,
    can_execute_prevention: true,
    can_update_incidents: true,
    can_view_reports: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync token to api & verify
  useEffect(() => {
    if (token) {
      localStorage.setItem("aegis_token", token);
      apiService.getCurrentUser()
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem("aegis_user", JSON.stringify(data.user));
          }
          if (data?.permissions) {
            setPermissions(data.permissions);
          }
        })
        .catch(() => {
          // Token expired or invalid
        });
    } else {
      localStorage.removeItem("aegis_token");
    }
  }, [token]);

  const login = async (usernameOrEmail, password) => {
    setIsLoading(true);
    try {
      const res = await apiService.login({ username: usernameOrEmail, password });
      if (res.token) {
        setToken(res.token);
        setUser(res.user);
        setPermissions(res.permissions || {});
        localStorage.setItem("aegis_token", res.token);
        localStorage.setItem("aegis_user", JSON.stringify(res.user));
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch {
      // Ignore
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("aegis_token");
      localStorage.removeItem("aegis_user");
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user),
    isLoading,
    permissions,
    isAdmin: user?.role === "ADMIN",
    isAnalyst: user?.role === "SECURITY_ANALYST" || user?.role === "ADMIN",
    isViewer: user?.role === "VIEWER",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
