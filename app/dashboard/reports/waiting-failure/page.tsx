"use client";

import ReportTable from "@/src/components/ReportTable";

export default function WaitingFailureReport() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportTable
        title="Waiting Period Sync Failures"
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/waiting-failure/`}
        columns={[
          { key: "scheme_id", label: "Scheme ID" },
          { key: "family_no", label: "Family No" },
          { key: "category", label: "Category" },
          { key: "benefit", label: "Benefit" },
          { key: "anniv", label: "Anniv" },
          { key: "status_code", label: "Status Code" },
          { key: "created_at", label: "Created At" },
        ]}
      />
    </div>
  );
}