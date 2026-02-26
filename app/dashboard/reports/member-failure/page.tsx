// "use client";

// import ReportTable from "@/src/components/ReportTable";

// export default function MemberSuccessReport() {
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <ReportTable
//         title="Member Sync Success"
//         endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/member-success/`}
//         columns={[
//           { key: "member_no", label: "Member No" },
//           { key: "family_no", label: "Family No" },
//           { key: "surname", label: "Surname" },
//           { key: "category", label: "Category" },
//           { key: "anniv", label: "Anniv" },
//           { key: "corp_id", label: "Corp ID" },
//           { key: "smart_status", label: "Status" },
//           { key: "created_at", label: "Created At" },
//         ]}
//       />
//     </div>
//   );
// }

"use client";

import ReportTable from "@/src/components/ReportTable";

export default function MemberSuccessReport() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportTable
        title="Member Sync failure"
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/member-failure/`}
        columns={[
          { key: "member_no", label: "Member No" },
          { key: "family_no", label: "Family No" },
          { key: "surname", label: "Surname" },
          { key: "category", label: "Category" },
          { key: "anniv", label: "Anniv" },
          { key: "corp_id", label: "Corp ID" },
          { key: "smart_status", label: "Status" },
          { key: "created_at", label: "Created At" },
        ]}
      />
    </div>
  );
}