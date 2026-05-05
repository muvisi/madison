"use client";

import Tables from "@/src/components/Tables";

const StatusBadge = ({ status }: { status?: string }) => {
  const normalized = status?.toLowerCase() || "";
  const base =
    "inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full";

  if (normalized.includes("fully"))
    return <span className={`${base} bg-green-100 text-green-700`}>✅ Fully Paid</span>;

  if (normalized.includes("partially"))
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>🕐 Partially Paid</span>;

  return <span className={`${base} bg-gray-100 text-gray-600`}>⚪ Unpaid</span>;
};

export default function StatusPage() {
  return (
    <div className="overflow-x-auto">
      <Tables
        title="Debit Payment Status"
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/debit-history`}
        transform={(data: any[]) =>
          data.map((row) => ({
            ...row,
            payment_status: <StatusBadge status={row.payment_status} />,
          }))
        }
        columns={[
          { key: "push_note_code", label: "Push Note" },
          { key: "policy_number", label: "Policy" },
          { key: "intermediary_name", label: "Intermediary" },
          { key: "broker_name", label: "Broker" },
          { key: "receipted_amount", label: "Receipted" },
          { key: "available_allocation", label: "Allocation" },
          { key: "broker_commission", label: "Broker Comm" },
          { key: "commission_payable", label: "Payable" },
          { key: "transaction_total_amount", label: "Total" },
          { key: "payment_status", label: "Status" },
        ]}
      />
    </div>
  );
}