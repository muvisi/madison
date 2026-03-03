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

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20; // Page size

  const fetchData = async () => {
    setLoading(true);
    try {
      // Build query params: only include filters that have values
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      );
      params.append("page", page.toString());

      const res = await fetch(`${endpoint}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      const data = await res.json();

      // DRF returns paginated data in 'results'
      setRows(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      toast.error("Failed to fetch data");
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    fetchData();
  }, [filters]);

  // Fetch when page changes
  useEffect(() => {
    fetchData();
  }, [page]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
          Total Records: <strong>{totalCount}</strong>
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap bg-white p-3 rounded-lg border shadow-sm">
        {columns.slice(0, 4).map((col) => (
          <input
            key={col.key}
            placeholder={`Filter ${col.label}`}
            value={filters[col.key] || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, [col.key]: e.target.value }))
            }
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48"
          />
        ))}
        <button
          onClick={() => setFilters({})}
          className="bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded text-sm font-medium transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-20 text-center text-gray-400 animate-pulse">Loading data...</div>
      ) : (
        <div className="overflow-x-auto border rounded-xl bg-white shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-600 text-white font-medium">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="p-4 border-b border-blue-500">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-10 text-center text-gray-500">
                    No data found matching your filters.
                  </td>
                </tr>
              ) : (
                rows.map((row: any, idx: number) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-blue-50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="p-4 text-gray-700">
                        {typeof row[col.key] === "object" ? JSON.stringify(row[col.key]) : row[col.key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="text-sm text-gray-500">
          Page <span className="font-bold text-gray-800">{page}</span> of <span className="font-bold text-gray-800">{totalPages || 1}</span>
        </div>
        <div className="flex gap-3">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage(page - 1)}
            className="px-5 py-2 border rounded-lg text-sm font-semibold disabled:opacity-30 hover:bg-gray-50 transition-all"
          >
            ← Previous
          </button>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => setPage(page + 1)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-30 hover:bg-blue-700 shadow-md transition-all"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}