"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Bulk", path: "/dashboard/bulk" },
  {
    name: "Members",
    path: "/dashboard/members",
    subItems: [
      { name: "Members ✅", path: "/dashboard/reports/member-success" },
      { name: "Members ❌", path: "/dashboard/reports/member-failure" },
    ],
  },
  {
    name: "Benefits",
    path: "/dashboard/benefits",
    subItems: [
      { name: "Benefits ✅", path: "/dashboard/reports/benefit-success" },
      { name: "Benefits ❌", path: "/dashboard/reports/benefit-failure" },
    ],
  },
  {
    name: "Categories",
    path: "/dashboard/categories",
    subItems: [
      { name: "Category ✅", path: "/dashboard/reports/hais-category-success" },
      { name: "Category ❌", path: "/dashboard/reports/hais-category-failure" },
    ],
  },
  // { name: "Copays", path: "/dashboard/copays" },
  {
    name: "Waiting Periods",
    path: "/dashboard/waiting-periods",
    subItems: [
      { name: "Waiting ✅", path: "/dashboard/reports/waiting-success" },
      { name: "Waiting ❌", path: "/dashboard/reports/waiting-failure" },
    ],
  },
  {
    name: "Restrictions",
    path: "/dashboard/restrictions",
    subItems: [
      { name: "Provider ✅", path: "/dashboard/reports/provider-success" },
      { name: "Provider ❌", path: "/dashboard/reports/provider-failure" },
    ],
  },
  { name: "Users", path: "/dashboard/users" },
  { name: "API Logs", path: "/dashboard/reports/api-sync" },
  { name: "Copay Logs", path: "/dashboard/reports/copays" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const pathname = usePathname();

  const toggleExpand = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div
      className={`h-full transition-all duration-500 ease-in-out bg-gray-200 text-gray-900 ${
        isOpen ? "w-64" : "w-16"
      } shadow-lg relative`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <span
          className={`font-bold text-xl tracking-wider transition-all duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 scale-90"
          }`}
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
          const hasSubItems = !!item.subItems?.length;
          const anySubActive = item.subItems?.some((sub) => pathname === sub.path);

          return (
            <div key={item.name} className="mb-2">
              {hasSubItems ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={`flex items-center justify-between py-3 px-4 rounded-md w-full text-left transition-all duration-300
                      ${
                        anySubActive
                          ? "bg-blue-500 text-white shadow-lg font-semibold"
                          : "bg-gray-200 hover:bg-blue-300 hover:text-white hover:shadow-md"
                      }`}
                  >
                    {isOpen ? item.name : item.name[0]}
                    {isOpen && (
                      <span
                        className={`transition-transform duration-300 ${
                          expanded[item.name] ? "rotate-90" : ""
                        }`}
                      >
                        {/* Bluish Eye Icon (always visible) */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          style={{ color: '#2563eb' }} // Tailwind blue-600
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                  {isOpen && expanded[item.name] && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {item.subItems!.map((sub) => {
                        const isSubActive = pathname === sub.path;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.path}
                            className={`py-2 px-3 rounded-md transition-all duration-300 text-sm ${
                              isSubActive
                                ? "bg-blue-400 text-white font-semibold"
                                : "bg-gray-100 hover:bg-blue-300 hover:text-white"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center gap-2 py-3 px-4 rounded-md m-1 transition-all duration-300
                    ${
                      isActive
                        ? "bg-blue-500 shadow-lg font-semibold text-white"
                        : "bg-gray-200 hover:bg-blue-300 hover:text-white hover:shadow-md"
                    }`}
                >
                  {isOpen ? item.name : item.name[0]}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}