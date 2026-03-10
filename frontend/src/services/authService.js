import api from "./api";

// Login with email and password
export const login = (data) => api.post("/auth/login/", data);

// Register a new user
export const register = (data) => api.post("/auth/register/", data);

// Logout (remove token client-side)
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get current user profile
export const getMe = () => api.get("/auth/me/");
