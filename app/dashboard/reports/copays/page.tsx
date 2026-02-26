"use client";

import ReportTable from "@/src/components/ReportTable";

export default function CopayReport() {
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