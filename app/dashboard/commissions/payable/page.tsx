"use client";

import Tables from "@/src/components/Tables";

export default function PayablePage() {
  return (
    <div className="overflow-x-auto">
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