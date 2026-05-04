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

// "use client";

// import ReportTable from "@/src/components/ReportTable";

// export default function MemberSuccessReport() {
//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
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
//           { key: "smart_status", label: "HTTP Code" },
//           { key: "created_at", label: "Sync Date" },
//         ]}
//       />
//     </div>
//   );
// ]}
"use client";

import React, { useEffect, useState } from "react";

interface Member {
  member_no: string;
  family_no: string;
  surname: string;
  second_name: string;
  third_name: string;
  category: string;
  anniv: string;
  corp_id: string;
  smart_status: number;
  created_at: string;
}

export default function MemberSuccessReport() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchCorpId, setSearchCorpId] = useState<string>("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/member-success/`
        );
        const json = await res.json();

        const data: Member[] =
          Array.isArray(json?.response?.result) ? json.response.result : [];

        setMembers(data);
      } catch (err) {
        console.error("Error fetching member success data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter((m) =>
    m.corp_id.toLowerCase().includes(searchCorpId.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Member Sync Success</h1>

      <input
        type="text"
        placeholder="Search by Corp ID..."
        value={searchCorpId}
        onChange={(e) => setSearchCorpId(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="p-2 border">Corp ID</th>
            <th className="p-2 border">Member No</th>
            <th className="p-2 border">Family No</th>
            <th className="p-2 border">Surname</th>
            <th className="p-2 border">Second Name</th>
            <th className="p-2 border">Third Name</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Anniv</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.length > 0 ? (
            filteredMembers.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{row.corp_id}</td>
                <td className="p-2 border">{row.member_no}</td>
                <td className="p-2 border">{row.family_no}</td>
                <td className="p-2 border">{row.surname}</td>
                <td className="p-2 border">{row.second_name}</td>
                <td className="p-2 border">{row.third_name}</td>
                <td className="p-2 border">{row.category}</td>
                <td className="p-2 border">{row.anniv}</td>
                <td className="p-2 border">{row.smart_status}</td>
                <td className="p-2 border">{new Date(row.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="p-2 border text-center">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}