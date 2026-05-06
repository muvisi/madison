"use client";

import ReportTable from "@/src/components/ReportTable";
import { useAccess } from "@/src/services/access";

export default function CopayReport() {
  const hasAccess = useAccess("underwriting");

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-500">
        Access denied. This module is restricted to Underwriting department only.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportTable
        title="Copay Logs"
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/copay/`}
        columns={[
          { key: "source", label: "Source" },
          { key: "transaction_name", label: "Transaction" },
          { key: "status_code", label: "Status Code" },
          { key: "status", label: "Status" },
          { key: "created_at", label: "Created At" },
        ]}
      />
    </div>
  );
}