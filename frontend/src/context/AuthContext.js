import React, { createContext, useState, useEffect } from "react";
import { login as loginApi } from "../services/authService";

// Create the context
export const AuthContext = createContext(null);

// Provider component – wrap your app with this
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, restore user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login: call API, store token + user, update state
  const login = async (email, password) => {
    const response = await loginApi({ email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return response;
  };

  // Logout: clear storage + state
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
