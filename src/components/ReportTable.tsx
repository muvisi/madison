"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAccessToken } from "@/src/services/auth";

interface ReportTableProps {
  title: string;
  endpoint: string;
  columns: { key: string; label: string }[];
}

export default function ReportTable({ title, endpoint, columns }: ReportTableProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters as any).toString();
      const res = await fetch(`${endpoint}?${query}`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      const data = await res.json();

      // Ensure rows is always an array
      const resultRows = Array.isArray(data.results)
        ? data.results
        : Array.isArray(data)
        ? data
        : [];

      setRows(resultRows);
    } catch (err) {
      toast.error("Failed to fetch data");
      setRows([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <div className="p-4 w-full max-w-6xl">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        {columns.map((col) => (
          <input
            key={col.key}
            placeholder={`Filter by ${col.label}`}
            value={filters[col.key] || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, [col.key]: e.target.value }))
            }
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
        ))}
        <button
          onClick={() => setFilters({})}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
        >
          Clear
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          {rows.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No data found.</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead className="bg-blue-100 text-blue-900 sticky top-0">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="p-2 border-b text-left">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(rows) ? rows : []).map((row: any, idx: number) => (
                  <tr key={idx} className="border-b hover:bg-blue-50">
                    {columns.map((col) => (
                      <td key={col.key} className="p-2">
                        {typeof row[col.key] === "object"
                          ? JSON.stringify(row[col.key])
                          : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}