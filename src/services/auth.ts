"use client";

// Demo: replace this with API calls later
const DEMO_USER = {
  username: "admin",
  password: "password",
};

export const login = (username: string, password: string): boolean => {
  // For now, simple hardcoded check
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", username);
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("username");
};

export const isLoggedIn = (): boolean => {
  return localStorage.getItem("loggedIn") === "true";
};

export const getCurrentUser = (): string | null => {
  return localStorage.getItem("username");
};