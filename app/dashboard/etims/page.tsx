"use client";

import { useState } from "react";
import Tables from "@/src/components/Tables";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function PaidPage() {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

    const getStatusClass = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800";

      case "FAILED":
        return "bg-red-100 text-red-800";

      case "PENDING":
        return "bg-yellow-100 text-yellow-800";

      case "SENT":
        return "bg-green-100 text-green-800"; 

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

    return (
    <div className="overflow-x-auto">
      <Tables
        title="eTIMS Debit/Credit Status"
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/etims/debit-credit/`}
    
   columns={[
          { key: "debit_credit_reference", label: "Debit/Credit Ref Number" },
          { key: "client_pin", label: "KRA Pin" },
          { key: "client_name", label: "Client Name" },
          { key: "etims_status", label: "Etims Status" ,
                render: (row: any) => (
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                  row.etims_status
                )}`}
              >
                {row.etims_status || "-"}
              </span>
            ), },
          { key: "sync_status", label: "Sync Status" , render: (row: any) => (
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                  row.sync_status
                )}`}
              >
                {row.sync_status || "-"}
              </span>
            ),},
          { key: "transaction_total_amount", label: "Transaction Amount" },
          { key: "source_pushnote_code", label: "Push Note Code" },
          { key: "transaction_code", label: "Transaction Code" },
          { key: "kra_message", label: "KRA Message" },
          { key: "kra_ref", label: "KRA Reference" },
          { key: "last_synced_at", label: "Last Synced At" }
          
        ]}
      />
    </div>
    );

}