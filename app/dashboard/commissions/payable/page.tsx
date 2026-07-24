"use client";

import Tables from "@/src/components/Tables";
import { FiFileText } from "react-icons/fi";

export default function PayablePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-lg text-blue-700">
          <FiFileText />
        </span>
        <div>
          <h3 className="font-semibold text-slate-900">Debited Business Register</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Review issued debit notes, transaction values, policies, and assigned intermediaries.
          </p>
        </div>
      </div>
      <Tables
        title="Debited business"
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/records/`}
        showDateFilter
        showAgentFilter
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
