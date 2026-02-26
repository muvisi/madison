"use client";

import { getCurrentUser, logout } from "../services/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Topbar() {
  const router = useRouter();
  const username = getCurrentUser();

  // If no active session, redirect to login/root
  useEffect(() => {
    if (!username) {
      router.push("/"); // redirect to login if not logged in
    }
  }, [username, router]);

  const handleLogout = () => {
    logout();           // clear token/session
    router.push("/");   // redirect to login
  };

  const goToDashboard = () => {
    router.push("/dashboard"); // optional: make the title clickable
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-blue-100/70 backdrop-blur-md shadow-md">
      <h2
        className="text-xl font-bold text-blue-900 animate-pulse cursor-pointer hover:underline"
        onClick={goToDashboard} // clicking title navigates to dashboard
      >
        Dashboard
      </h2>
      <div className="flex items-center gap-4">
        <span className="text-blue-900 font-medium">Hi, {username}</span>
        <button
          onClick={handleLogout}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}