"use client";

// ---------- Login ----------
export const login = async (username: string, password: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.detail || "Invalid credentials");

    // Save tokens and user info
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    localStorage.setItem("username", data.username);
    localStorage.setItem("uuid", data.uuid);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// ---------- Logout ----------
export const logout = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
  localStorage.removeItem("uuid");
};

// ---------- Auth helpers ----------
export const isLoggedIn = (): boolean => !!localStorage.getItem("accessToken");

export const getCurrentUser = (): string | null => localStorage.getItem("username");

export const getAccessToken = (): string | null => localStorage.getItem("accessToken");

export const getRefreshToken = (): string | null => localStorage.getItem("refreshToken");