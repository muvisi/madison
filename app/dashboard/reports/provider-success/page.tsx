"use client";

import ReportTable from "@/src/components/ReportTable";

export default function ProviderSuccessReport() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportTable
        title="Provider Restriction Sync Success"
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/provider-success/`}
        columns={[
          { key: "corp_id", label: "Corp ID" },
          { key: "provider_code", label: "Provider Code" },
          { key: "smart_restriction_category", label: "Category" },
          { key: "user_id", label: "User ID" },
          { key: "status_code", label: "Status Code" },
          { key: "created_at", label: "Created At" },
        ]}
      />
    </div>
  );
}