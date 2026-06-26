"use client";

import { useState } from "react";
import Tables from "@/src/components/Tables";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function PaidPage() {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
        title="Paid Commissions"
        showAgentFilter={true}
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
          { key: "broker_commission", label: "Broker Comm" },
          { key: "withholding_tax", label: "WHT" },
          { key: "commission_payable", label: "Payable" },
          { key: "commission_status", label: "Commission Status" },
          { key: "paid_at", label: "Payment Date" },
        ]}
      />
    </div>
    );
}