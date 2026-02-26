"use client";

import ReportTable from "@/src/components/ReportTable";

export default function HaisCategoryFailureReport() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportTable
        title="HAIS Category Sync Failure"
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/hais-category-failure/`}
        columns={[
          { key: "corp_id", label: "Corp ID" },
          { key: "category_name", label: "Category Name" },
          { key: "anniv", label: "Anniv" },
          { key: "user_id", label: "User ID" },
          { key: "status_code", label: "Status Code" },
          { key: "created_at", label: "Created At" },
        ]}
      />
    </div>
  );
}