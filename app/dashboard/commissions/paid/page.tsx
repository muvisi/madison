"use client";

import Tables from "@/src/components/Tables";
import { FiCheckCircle } from "react-icons/fi";

export default function PaidPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-lg text-emerald-700">
          <FiCheckCircle />
        </span>
        <div>
          <h3 className="font-semibold text-slate-900">Paid Commission History</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Access completed broker payments and export a structured, audit-ready commission report.
          </p>
        </div>
      </div>
      <Tables
        title="Paid commissions"
        exportVariant="healthcare-commissions"
        exportReportTitle="Paid Healthcare Commissions"
        showDateFilter
        exactDateKey="paid_at"
        showAgentFilter
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/paid/`}
        columns={[
          { key: "push_note_code", label: "Push Note" },
          { key: "debit_code", label: "Debit Note" },
          { key: "payment_status", label: "Debit Status" },
          { key: "policy_number", label: "Policy" },
          { key: "customer_name", label: "Customer" },
          { key: "broker_name", label: "Broker" },
          { key: "receipted_amount", label: "Receipted" },
          { key: "available_allocation", label: "Allocation" },
          { key: "broker_commission", label: "Broker Commission" },
          { key: "withholding_tax", label: "WHT" },
          { key: "commission_payable", label: "Payable" },
          { key: "commission_status", label: "Commission Status" },
          { key: "paid_at", label: "Payment Date" },
        ]}
      />
    </div>
  );
}
