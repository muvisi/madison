"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiActivity,
  FiBarChart2,
  FiChevronDown,
  FiChevronRight,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiGrid,
  FiLayers,
  FiPackage,
  FiRefreshCw,
  FiShield,
  FiUsers,
  FiX,
  FiZap,
} from "react-icons/fi";
import type { IconType } from "react-icons";

type NavigationItem = {
  name: string;
  path?: string;
  icon: IconType;
  children?: { name: string; path: string }[];
};

const navigationGroups: { label: string; items: NavigationItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { name: "Overview", path: "/dashboard", icon: FiGrid },
      { name: "Bulk Operations", path: "/dashboard/bulk", icon: FiZap },
    ],
  },
  {
    label: "Healthcare Operations",
    items: [
      {
        name: "Members",
        icon: FiUsers,
        children: [
          { name: "Member registry", path: "/dashboard/members" },
          { name: "Successful syncs", path: "/dashboard/reports/member-success" },
          { name: "Failed syncs", path: "/dashboard/reports/member-failure" },
        ],
      },
      {
        name: "Benefits",
        icon: FiPackage,
        children: [
          { name: "Successful syncs", path: "/dashboard/reports/benefit-success" },
          { name: "Failed syncs", path: "/dashboard/reports/benefit-failure" },
        ],
      },
      {
        name: "Categories",
        icon: FiLayers,
        children: [
          { name: "Successful syncs", path: "/dashboard/reports/hais-category-success" },
          { name: "Failed syncs", path: "/dashboard/reports/hais-category-failure" },
        ],
      },
      {
        name: "Waiting Periods",
        icon: FiClock,
        children: [
          { name: "Waiting period report", path: "/dashboard/reports/waiting-failure" },
        ],
      },
      {
        name: "Provider Restrictions",
        icon: FiShield,
        children: [
          { name: "Successful syncs", path: "/dashboard/reports/provider-success" },
          { name: "Failed syncs", path: "/dashboard/reports/provider-failure" },
        ],
      },
      {
        name: "Care Management",
        icon: FiShield,
        children: [
          { name: "Daily Admissions Report", path: "/dashboard/caremanagement/lou-report" },
          { name: "Follow-up Report", path: "/dashboard/caremanagement/followup-report" },
          
        ],
      },
    ],
  },
  {
    label: "Finance & Compliance",
    items: [
      { name: "Commissions", path: "/dashboard/commissions", icon: FiCreditCard },
      { name: "eTIMS Status", path: "/dashboard/etims", icon: FiFileText },
      { name: "Copay Logs", path: "/dashboard/reports/copays", icon: FiBarChart2 },
    ],
  },
  {
    label: "Administration",
    items: [
      { name: "Users & Access", path: "/dashboard/users", icon: FiUsers },
      { name: "API Activity", path: "/dashboard/reports/api-sync", icon: FiRefreshCw },
    ],
  },
];

export default function Sidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const activeParent = navigationGroups
      .flatMap((group) => group.items)
      .find((item) => item.children?.some((child) => pathname === child.path));
    if (activeParent) {
      setExpanded((current) => ({ ...current, [activeParent.name]: true }));
    }
  }, [pathname]);

  const content = (
    <aside className="flex h-full flex-col bg-[#082f55] text-white">
      <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-6">
        <Link href="/dashboard" onClick={onMobileClose}>
          <img
            src="/madison-group-logo.png"
            alt="Madison Group"
            className="h-auto w-[190px]"
          />
        </Link>
        <button
          onClick={onMobileClose}
          aria-label="Close navigation"
          className="grid h-9 w-9 place-items-center rounded-lg text-blue-100 hover:bg-white/10 lg:hidden"
        >
          <FiX className="text-xl" />
        </button>
      </div>

      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-3.5 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#35b596]/20 text-[#53d0b2]">
            <FiActivity />
          </span>
          <span>
            <span className="block text-xs text-blue-100/60">Environment</span>
            <span className="block text-sm font-medium text-white">Healthcare operations</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5">
        {navigationGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-200/45">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const childActive = item.children?.some(
                  (child) => pathname === child.path
                );
                const active =
                  pathname === item.path ||
                  (item.path !== "/dashboard" &&
                    Boolean(item.path && pathname.startsWith(item.path))) ||
                  childActive;

                if (item.children) {
                  const open = expanded[item.name] || childActive;
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() =>
                          setExpanded((current) => ({
                            ...current,
                            [item.name]: !current[item.name],
                          }))
                        }
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                          active
                            ? "bg-white/10 font-medium text-white"
                            : "text-blue-100/75 hover:bg-white/[0.07] hover:text-white"
                        }`}
                      >
                        <Icon className="text-[17px]" />
                        <span className="flex-1 text-left">{item.name}</span>
                        {open ? <FiChevronDown /> : <FiChevronRight />}
                      </button>
                      {open && (
                        <div className="ml-5 mt-1 space-y-1 border-l border-white/10 pl-5">
                          {item.children.map((child) => (
                            <Link
                              key={child.path}
                              href={child.path}
                              onClick={onMobileClose}
                              className={`block rounded-lg px-3 py-2 text-xs transition ${
                                pathname === child.path
                                  ? "bg-[#36b79a] font-semibold text-white"
                                  : "text-blue-100/60 hover:bg-white/[0.07] hover:text-white"
                              }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.path!}
                    onClick={onMobileClose}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-[#36b79a] font-semibold text-white shadow-lg shadow-black/10"
                        : "text-blue-100/75 hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    <Icon className="text-[17px]" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-[11px] leading-5 text-blue-100/45">
          Madison Healthcare Platform
          <br />
          Secure enterprise workspace
        </p>
      </div>
    </aside>
  );

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-40 hidden w-[272px] lg:block">
        {content}
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation overlay"
            onClick={onMobileClose}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />
          <div className="relative h-full w-[min(88vw,320px)] shadow-2xl">{content}</div>
        </div>
      )}
    </>
  );
}
