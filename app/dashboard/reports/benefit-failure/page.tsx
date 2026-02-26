"use client";

import ReportTable from "@/src/components/ReportTable";

export default function BenefitFailureReport() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportTable
        title="Benefit Sync Failure"
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/benefit-failure/`}
        columns={[
          { key: "corp_id", label: "Corp ID" },
          { key: "category", label: "Category" },
          { key: "benefit_id", label: "Benefit ID" },
          { key: "benefit_name", label: "Benefit Name" },
          { key: "policy_no", label: "Policy No" },
          { key: "smart_status", label: "Status" },
          { key: "created_at", label: "Created At" },
        ]}
      />
    </div>
  );
}