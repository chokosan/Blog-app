import React, { createContext, useContext, useState, useCallback } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [status, setStatus] = useState("idle"); // idle | loading | succeeded | failed
  const [error, setError] = useState(null);

  // POST /user/login
  const login = useCallback(async ({ email, password }) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.post("/user/login", { email, password });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Login failed");
      }
      const { user: newUser, token: newToken, message } = res.data;
      setUser(newUser);
      setToken(newToken);
      setStatus("succeeded");
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", newToken);
      return { user: newUser, token: newToken, message };
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Login failed";
      setStatus("failed");
      setError(message);
      throw message; // mirrors redux .unwrap() behavior: throws the rejected value
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setStatus("idle");
    setError(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  const setCredentials = useCallback(({ user: newUser, token: newToken } = {}) => {
    setUser(newUser || null);
    setToken(newToken || null);
    localStorage.setItem("user", JSON.stringify(newUser || null));
    if (newToken) localStorage.setItem("token", newToken);
  }, []);

  const value = { user, token, status, error, login, logout, setCredentials };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};