"use client";

import ReportTable from "@/src/components/ReportTable";

export default function ApiSyncReport() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportTable
        title="API Sync Logs"
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/api-sync/`}
        columns={[
          { key: "api_name", label: "API Name" },
          { key: "transaction_name", label: "Transaction" },
          { key: "status", label: "Status" },
          { key: "http_code", label: "HTTP Code" },
          { key: "created_at", label: "Created At" },
        ]}
      />
    </div>
  );
}