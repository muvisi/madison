"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/src/services/auth";
import { saveAs } from "file-saver";

export default function BulkUploadPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // 🔐 Auth Guard
  useEffect(() => {
    const token = getAccessToken();
    if (!token) router.replace("/");
    else setLoading(false);
  }, [router]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  // 📥 Download Sample Excel
  const downloadSample = () => {
    const sampleData = [
      ["family_no"],
      ["MAU/631706/00"],
      ["MAU/631706/01"],
      ["MAU/631706/02"],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, "family_numbers_sample.xlsx");
  };

  // 📥 Read Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 });

      const values = json
        .flat()
        .map((v: any) => String(v).trim())
        .filter((v: string) => v && v.toLowerCase() !== "family_no");

      setRows(values);
      toast.success(`Loaded ${values.length} family numbers`);
    };

    reader.readAsBinaryString(file);
  };

  // 🚀 Push All as LIST to authenticated API
  const handlePushAll = async () => {
    if (!rows.length) {
      toast.error("No data to push");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      toast.error("Authentication required");
      router.replace("/");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(`Pushing ${rows.length} records...`);

    try {
      for (const familyNo of rows) {
        const response = await fetch(`${API_BASE}/api/trigger/trigger/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            section: "Members",
            memberNo: familyNo,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to push a record");
        }
      }

      toast.success("Bulk push completed", { id: toastId });
      setRows([]);
    } catch (err: any) {
      toast.error(`Bulk push failed: ${err.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Bulk Upload – Family Numbers
      </h1>

      {/* Upload + Download Inline */}
      <div className="bg-white shadow-xl rounded-2xl p-4 w-full max-w-3xl flex items-center justify-between mb-4 gap-2">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          disabled={isSubmitting}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm cursor-pointer"
        />
        <button
          onClick={downloadSample}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg shadow-sm transition text-sm"
        >
          Download Sample
        </button>

        
      </div>

      {/* Preview Table */}
      {rows.length > 0 && (
        <div className="bg-white shadow rounded-2xl p-4 w-full max-w-3xl mb-4 max-h-64 overflow-y-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-blue-100 text-blue-900 sticky top-0">
              <tr>
                <th className="p-2 text-left border-b">#</th>
                <th className="p-2 text-left border-b">Family No</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-b hover:bg-blue-50">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{row}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Push Button */}
      <button
        onClick={handlePushAll}
        disabled={isSubmitting || !rows.length}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50"
      >
        {isSubmitting ? "Pushing..." : "Push All"}
      </button>
    </div>
  );
}