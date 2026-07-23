"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiChevronDown, FiLogOut, FiMenu, FiSearch } from "react-icons/fi";
import { logout } from "@/src/services/auth";

const pageNames: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/bulk": "Bulk Operations",
  "/dashboard/members": "Members",
  "/dashboard/commissions": "Commissions",
  "/dashboard/commissions/pay": "Pay Commissions",
  "/dashboard/commissions/paid": "Paid Commissions",
  "/dashboard/commissions/payable": "Commission Payable",
  "/dashboard/etims": "eTIMS Status",
  "/dashboard/users": "User Administration",
};

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState("User");
  const [department, setDepartment] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "User");
    setDepartment(localStorage.getItem("department") || "Operations");
  }, []);

  const pageName =
    pageNames[pathname] ||
    Object.entries(pageNames)
      .filter(([path]) => path !== "/dashboard" && pathname.startsWith(path))
      .sort(([a], [b]) => b.length - a.length)[0]?.[1] ||
    "Workspace";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur">
      <div className="flex h-[72px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
        >
          <FiMenu className="text-xl" />
        </button>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Madison Healthcare
          </p>
          <h1 className="truncate text-lg font-semibold text-slate-900">{pageName}</h1>
        </div>

        <div className="ml-auto hidden w-full max-w-sm items-center sm:flex">
          <div className="relative w-full">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Search workspace"
              placeholder="Search workspace"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-3 rounded-xl p-1.5 text-left transition hover:bg-slate-50"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0c477d] text-sm font-semibold text-white">
              {username.slice(0, 2).toUpperCase()}
            </span>
            <span className="hidden min-w-0 md:block">
              <span className="block max-w-32 truncate text-sm font-semibold text-slate-800">
                {username}
              </span>
              <span className="block max-w-32 truncate text-xs text-slate-500">
                {department}
              </span>
            </span>
            <FiChevronDown className="hidden text-slate-400 md:block" />
          </button>

          {menuOpen && (
            <>
              <button
                aria-label="Close account menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="border-b border-slate-100 px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-slate-800">{username}</p>
                  <p className="truncate text-xs text-slate-500">{department}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <FiLogOut />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
