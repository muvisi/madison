"use client";

import { useAccess } from "@/src/services/access";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function CommissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {

   const [userDepartment, setUserDepartment] = useState<string | null>(null);
    const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  
    useEffect(() => {
      const department = localStorage.getItem("department");
      setUserDepartment(department);
    }, []);

      useEffect(() => {
    const username = localStorage.getItem("username");
    setCurrentUsername(username);
  }, []);


    
  const pathname = usePathname();

  const nav = [
    {
      href: "/dashboard/commissions/payable",
      label: "Debited Business",
      desc: "View all issued debit notes",
      icon: "📄",
    },
    {
      href: "/dashboard/commissions/status",
      label: "Debit Status",
      desc: "Track payment & allocation status",
      icon: "📊",
    },
    {
      href: "/dashboard/commissions/pay",
      label: "Pay Commissions",
      desc: "Process broker commission payouts",
      icon: "💰",
    },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  
    const hasAccess = useAccess("finance");
    
      if (!hasAccess) {
        return (
          <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-500">
            Access denied. This module is restricted to Finance department only.
          </div>
        );
      }

  //   if (userDepartment !== "finance" && currentUsername !== "admin") {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-500">
  //       Access denied. This module is restricted to Finance department only.
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Commission Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage commissions, allocations, and payouts
        </p>
      </div>

      {/* FLEX CARD NAV */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {nav.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative rounded-xl border p-5 transition-all
                  ${
                    active
                      ? "bg-gray-900 text-white border-gray-900 shadow-md"
                      : "bg-white hover:bg-gray-100 border-gray-200"
                  }
                `}
              >
                {/* ICON */}
                <div className="text-2xl mb-3">{item.icon}</div>

                {/* TITLE */}
                <h3
                  className={`text-sm font-semibold ${
                    active ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.label}
                </h3>

                {/* DESCRIPTION */}
                <p
                  className={`text-xs mt-1 ${
                    active ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {item.desc}
                </p>

                {/* ACTIVE INDICATOR */}
                {active && (
                  <span className="absolute top-3 right-3 text-xs bg-white text-gray-900 px-2 py-0.5 rounded">
                    Active
                  </span>
                )}
              </Link>
            );
          })}

        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

