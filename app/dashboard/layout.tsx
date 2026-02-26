"use client";

import Sidebar from "../../src/components/Sidebar";
import Topbar from "../../src/components/Topbar";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // ---------- Auth Guard ----------
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/"); // Redirect if not authenticated
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-blue-600 text-lg font-semibold">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {/* Background triangles */}
      <div className="absolute inset-0 -z-10">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-10 h-10 md:w-12 md:h-12 bg-gray-400/20 transform rotate-[45deg] animate-float transition-colors duration-300 hover:bg-blue-300/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Sticky Topbar */}
      <div className="sticky top-0 z-20">
        <Topbar />
      </div>

      {/* Main layout: Sidebar + content */}
      <div className="flex">
        {/* Sidebar below Topbar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Triangle animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(45deg);
          }
          50% {
            transform: translateY(-15px) rotate(45deg);
          }
          100% {
            transform: translateY(0px) rotate(45deg);
          }
        }
        .animate-float {
          animation-name: float;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </div>
  );
}