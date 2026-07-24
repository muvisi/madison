"use client";

import Tables from "@/src/components/Tables";
import { FiActivity } from "react-icons/fi";

const StatusBadge = ({ status }: { status?: unknown }) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("fully")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Fully paid
      </span>
    );
  }
  if (normalized.includes("partially")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Partially paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Unpaid
    </span>
  );
};

export default function StatusPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-lg text-amber-700">
          <FiActivity />
        </span>
        <div>
          <h3 className="font-semibold text-slate-900">Allocation & Payment Status</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Monitor receipted amounts, available allocations, commission values, and debit settlement.
          </p>
        </div>
      </div>
      <Tables
        title="Debit payment status"
        showAgentFilter
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/debit-history`}
        columns={[
          { key: "push_note_code", label: "Push Note" },
          { key: "policy_number", label: "Policy" },
          { key: "intermediary_name", label: "Intermediary" },
          { key: "broker_name", label: "Broker" },
          { key: "receipted_amount", label: "Receipted" },
          { key: "available_allocation", label: "Allocation" },
          { key: "broker_commission", label: "Broker Commission" },
          { key: "commission_payable", label: "Payable" },
          { key: "transaction_total_amount", label: "Transaction Total" },
          {
            key: "payment_status",
            label: "Status",
            render: (row) => <StatusBadge status={row.payment_status} />,
          },
        ]}
      />
    </div>
  );
}
