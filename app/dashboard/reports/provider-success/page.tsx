"use client";

import ReportTable from "@/src/components/ReportTable";
import { useAccess } from "@/src/services/access";

export default function ProviderSuccessReport() {
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