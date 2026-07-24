import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiShield,
} from "react-icons/fi";

const workspaces = [
  {
    title: "Debited Business",
    description: "Review debit notes and underlying transaction values.",
    href: "/dashboard/commissions/payable",
    icon: FiFileText,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Payment Status",
    description: "Track receipts, allocations, and outstanding balances.",
    href: "/dashboard/commissions/status",
    icon: FiClock,
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "Authorize Payments",
    description: "Validate commission calculations before payment approval.",
    href: "/dashboard/commissions/pay",
    icon: FiCreditCard,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Paid History",
    description: "Access completed payments and export audit-ready reports.",
    href: "/dashboard/commissions/paid",
    icon: FiCheckCircle,
    color: "bg-violet-50 text-violet-700",
  },
];

export default function CommissionsOverview() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Commission workspace
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            Choose a workflow
          </h3>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {workspaces.map((workspace) => {
            const Icon = workspace.icon;
            return (
              <Link
                key={workspace.href}
                href={workspace.href}
                className="group rounded-xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_10px_28px_rgba(15,23,42,0.07)]"
              >
                <span className={`grid h-11 w-11 place-items-center rounded-xl text-lg ${workspace.color}`}>
                  <Icon />
                </span>
                <h4 className="mt-4 font-semibold text-slate-900">{workspace.title}</h4>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {workspace.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0c477d]">
                  Open workspace
                  <FiArrowRight className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <aside className="rounded-2xl bg-[#0c477d] p-6 text-white">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-xl">
          <FiShield />
        </span>
        <h3 className="mt-5 text-lg font-semibold">Controlled finance workflow</h3>
        <p className="mt-2 text-sm leading-6 text-blue-100/75">
          Commission payments move through a transparent, reviewable process
          designed for finance governance.
        </p>
        <ol className="mt-6 space-y-4">
          {[
            "Confirm debit and receipt information",
            "Review commission and withholding values",
            "Authorize eligible broker payments",
            "Retain paid records for audit reporting",
          ].map((step, index) => (
            <li key={step} className="flex gap-3 text-sm text-blue-50">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
