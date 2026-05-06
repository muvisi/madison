"use client";

import Tables from "@/src/components/Tables";
import Link from "next/link";

export default function PayablePage() {
  return (
    <div className="overflow-x-auto">
       <div className="mb-4">
        <Link
          href="/dashboard/commissions"
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded flex items-center gap-2 inline-flex"
        >
          ← Back to dashboard
        </Link>
      </div>
      <Tables
        title="Commissions Payable"
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/records/`}
        showDateFilter
        exactDateKey="push_note_request_date"
        columns={[
          { key: "dr_cr_note_number", label: "Debit Note" },
          { key: "push_note_request_date", label: "Push Note Date" },
          { key: "policy_number", label: "Policy Number" },
          { key: "intermediary_name", label: "Intermediary" },
          { key: "broker_name", label: "Broker" },
          { key: "commission_amount", label: "Commission" },
          { key: "transaction_total_amount", label: "Transaction" },
        ]}
      />
    </div>
  );
}