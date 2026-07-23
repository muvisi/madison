"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiLayers,
  FiRefreshCw,
  FiShield,
  FiUsers,
  FiZap,
} from "react-icons/fi";

const modules = [
  {
    name: "Member Operations",
    description: "Manage member records and monitor data synchronization.",
    href: "/dashboard/members",
    icon: FiUsers,
    color: "bg-blue-50 text-blue-700",
  },
  {
    name: "Benefit Configuration",
    description: "Review benefits, categories, waiting periods, and restrictions.",
    href: "/dashboard/reports/benefit-success",
    icon: FiLayers,
    color: "bg-violet-50 text-violet-700",
  },
  {
    name: "Commission Management",
    description: "Review payable commissions and complete finance workflows.",
    href: "/dashboard/commissions",
    icon: FiCreditCard,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    name: "Integration Monitoring",
    description: "Track API synchronization and resolve processing exceptions.",
    href: "/dashboard/reports/api-sync",
    icon: FiRefreshCw,
    color: "bg-amber-50 text-amber-700",
  },
];

const quickActions = [
  { label: "Run bulk operation", href: "/dashboard/bulk", icon: FiZap },
  { label: "Review commissions", href: "/dashboard/commissions/payable", icon: FiCreditCard },
  { label: "Check eTIMS status", href: "/dashboard/etims", icon: FiFileText },
];

export default function DashboardHome() {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "User");
  }, []);

  const date = new Intl.DateTimeFormat("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid lg:grid-cols-[1fr_360px]">
          <div className="p-6 sm:p-8">
            <p className="text-sm font-medium text-[#2b6b9c]">{date}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Good to see you, {username}.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Your healthcare operations workspace brings member administration,
              integrations, commissions, and compliance workflows together.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0c477d]"
                  >
                    <Icon />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="relative flex min-h-52 items-center bg-[#0c477d] p-8 text-white">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full border-[42px] border-white/[0.05]" />
            <div className="relative">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-xl">
                <FiShield />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-100/70">
                Enterprise workspace
              </p>
              <p className="mt-2 text-xl font-semibold">Secure by design</p>
              <p className="mt-2 text-sm leading-6 text-blue-100/75">
                Protected access to operational and financial workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Core workspace
            </p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">Operations modules</h3>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.name}
                href={module.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
              >
                <div className={`grid h-11 w-11 place-items-center rounded-xl text-lg ${module.color}`}>
                  <Icon />
                </div>
                <h4 className="mt-5 font-semibold text-slate-900">{module.name}</h4>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {module.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0c477d]">
                  Open module
                  <FiArrowRight className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h3 className="font-semibold text-slate-900">System overview</h3>
              <p className="mt-1 text-sm text-slate-500">Key operational services</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Workspace ready
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { name: "Member synchronization", icon: FiUsers, note: "Member data workflows" },
              { name: "Healthcare configuration", icon: FiActivity, note: "Benefits and policy rules" },
              { name: "Finance workflows", icon: FiCreditCard, note: "Commissions and eTIMS" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="flex items-center gap-4 px-6 py-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">{item.name}</span>
                    <span className="block text-xs text-slate-500">{item.note}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <FiCheckCircle />
                    Available
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
              <FiClock />
            </span>
            <div>
              <h3 className="font-semibold text-slate-900">Need attention?</h3>
              <p className="text-sm text-slate-500">Review exceptions and activity</p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {[
              { label: "Failed member syncs", href: "/dashboard/reports/member-failure" },
              { label: "Failed benefit syncs", href: "/dashboard/reports/benefit-failure" },
              { label: "API activity log", href: "/dashboard/reports/api-sync" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-100 hover:bg-blue-50 hover:text-[#0c477d]"
              >
                {item.label}
                <FiArrowRight />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
