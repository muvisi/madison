"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiGrid,
} from "react-icons/fi";

const navigation = [
  { href: "/dashboard/commissions", label: "Overview", icon: FiGrid, exact: true },
  { href: "/dashboard/commissions/payable", label: "Debited Business", icon: FiFileText },
  { href: "/dashboard/commissions/status", label: "Payment Status", icon: FiClock },
  { href: "/dashboard/commissions/pay", label: "Authorize Payments", icon: FiCreditCard },
  { href: "/dashboard/commissions/paid", label: "Paid History", icon: FiCheckCircle },
];

export default function CommissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#2b6b9c]">
              <span className="h-2 w-2 rounded-full bg-[#36b79a]" />
              Finance operations
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Commission Management
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review debited business, monitor allocations, authorize broker
              payments, and maintain a complete payment history.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-xs font-medium text-blue-600">Workflow</p>
            <p className="mt-0.5 text-sm font-semibold text-[#0c477d]">
              Debit → Allocate → Authorize → Paid
            </p>
          </div>
        </div>

        <nav
          aria-label="Commission workflow"
          className="overflow-x-auto border-t border-slate-100 px-3"
        >
          <div className="flex min-w-max gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition ${
                    active
                      ? "text-[#0c477d]"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Icon />
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#0c477d]" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </section>

      {children}
    </div>
  );
}
