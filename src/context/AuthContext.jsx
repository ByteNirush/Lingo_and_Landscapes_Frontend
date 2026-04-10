import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { getProfile } from "../utils/authApi";

const AuthContext = createContext(null);

const getStoredAuth = () => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser) {
    return { token: null, user: null };
  }

  try {
    return { token, user: JSON.parse(savedUser) };
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(getStoredAuth);
  const [loading, setLoading] = useState(true);
  const { token, user } = session;
  useEffect(() => {
    if (!token) {
      delete api.defaults.headers.common["Authorization"];
    } else {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // 🔥 No backend call
    setLoading(false);
  }, [token]);

  /* useEffect(() => {
    if (!token) {
      delete api.defaults.headers.common["Authorization"];
      setLoading(false);
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const loadProfile = async () => {
      try {
        const profile = await getProfile();

        setSession((prev) => {
          const mergedUser = {
            ...(prev.user || {}),
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            role: profile.role,
            country: profile.country,
            passport_number: profile.passport_number,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
          };

          localStorage.setItem("user", JSON.stringify(mergedUser));

          return {
            ...prev,
            user: mergedUser,
          };
        });
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common["Authorization"];
        setSession({ token: null, user: null });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]); */

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setSession({ token, user: userData });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setSession({ token: null, user: null });
  };

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAdmin, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
