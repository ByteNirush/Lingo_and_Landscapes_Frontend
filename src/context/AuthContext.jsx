

import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { signin as apiSignin, signup as apiSignup, getProfile } from "../utils/authApi";

const AuthContext = createContext(null);

const getStoredAuth = () => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  if (!token || !savedUser) return { token: null, user: null };
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
      setLoading(false);
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setSession((prev) => {
          const mergedUser = { ...prev.user, ...profile };
          localStorage.setItem("user", JSON.stringify(mergedUser));
          return { ...prev, user: mergedUser };
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
  }, [token]);

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

  const devLogin = async (email, password) => {
    const response = await apiSignin({ email, password });
    login(response.user, response.token);
    return response.user;
  };

  const devRegister = async (formData) => {
    const response = await apiSignup(formData);
    login(response.user, response.token);
    return response.user;
  };

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAdmin,
        isAuthenticated,
        devLogin,
        devRegister,
      }}
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
