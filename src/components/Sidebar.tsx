"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Members", path: "/dashboard/members" },
  { name: "Benefits", path: "/dashboard/benefits" },
  { name: "Categories", path: "/dashboard/categories" },
  { name: "Copays", path: "/dashboard/copays" },
  { name: "Waiting Periods", path: "/dashboard/waiting-periods" },
  { name: "Restrictions", path: "/dashboard/restrictions" },
  { name: "Users", path: "/dashboard/users" }, // ✅ Added Users page
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div
      className={`h-full transition-all duration-500 ease-in-out bg-gray-200 text-white ${
        isOpen ? "w-64" : "w-16"
      } shadow-lg relative`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <span
          className={`font-bold text-xl tracking-wider transition-all duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 scale-90"
          } text-gray-900`}
        >
          Madison
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-900 hover:text-gray-600 transition"
        >
          {isOpen ? "«" : "»"}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="mt-6">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-2 py-3 px-4 rounded-md m-1 transition-all duration-300
                ${
                  isActive
                    ? "bg-blue-500 shadow-lg font-semibold text-white"
                    : "bg-gray-200 text-gray-900 hover:bg-blue-300 hover:text-white hover:shadow-md"
                }
              `}
            >
              {isOpen ? item.name : item.name[0]}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}