"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import Select from "react-select";
import toast from "react-hot-toast";
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import { getAccessToken } from "@/src/services/auth";
import { exportHealthcareCommissions } from "@/src/utils/exportHealthcareCommissions";

type DataRow = Record<string, unknown>;
type Column = {
  key: string;
  label: string;
  render?: (row: DataRow) => React.ReactNode;
};

interface ReportTableProps {
  title: string;
  endpoint: string;
  columns: Column[];
  showDateFilter?: boolean;
  exactDateKey?: string;
  displayCheckBoxes?: boolean;
  transform?: (data: DataRow[]) => DataRow[];
  hidePagination?: boolean;
  showAgentFilter?: boolean;
  exportVariant?: "default" | "healthcare-commissions";
  exportReportTitle?: string;
  onSelectionChange?: (rows: DataRow[]) => void;
}

interface AgentOption {
  value: string;
  label: string;
}

const moneyKeys = new Set([
  "receipted_amount",
  "available_allocation",
  "broker_commission",
  "withholding_tax",
  "commission_payable",
  "commission_amount",
  "transaction_total_amount",
  "transactionstotalamount",
]);

const formatCellValue = (key: string, value: unknown) => {
  if (value === null || value === undefined || value === "") return "—";
  if (moneyKeys.has(key)) {
    const number = Number(value);
    return Number.isFinite(number)
      ? number.toLocaleString("en-KE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : String(value);
  }
  return typeof value === "object" ? JSON.stringify(value) : String(value);
};

export default function ReportTable({
  title,
  endpoint,
  columns,
  showDateFilter,
  exactDateKey,
  displayCheckBoxes,
  hidePagination,
  onSelectionChange,
  showAgentFilter,
  transform,
  exportVariant = "default",
  exportReportTitle,
}: ReportTableProps) {
  const [rows, setRows] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<DataRow[]>([]);
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const pageSize = 20;

  const summaryTotals = useMemo<Record<string, number>>(
    () =>
      selectedRows.reduce<Record<string, number>>(
        (totals, row) => {
          moneyKeys.forEach((key) => {
            totals[key] = (totals[key] || 0) + (Number(row[key]) || 0);
          });
          return totals;
        },
        {} as Record<string, number>
      ),
    [selectedRows]
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await fetch(`${endpoint}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      const sourceRows: DataRow[] = data.results || data || [];
      setRows(transform ? transform(sourceRows) : sourceRows);
      setTotalCount(data.count || data.pagination?.count || sourceRows.length);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load report data");
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  useEffect(() => {
    const fetchAgents = async () => {
      if (!showAgentFilter) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/commisions/getagentbrokers/`,
          { headers: { Authorization: `Bearer ${getAccessToken()}` } }
        );
        if (!response.ok) return;
        const data = await response.json();
        const items = data.results || data || [];
        setAgents(
          (items as { agentbrokername?: unknown }[])
            .map((agent) => ({
              value: String(agent.agentbrokername || ""),
              label: String(agent.agentbrokername || ""),
            }))
            .filter((agent) => agent.value)
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchAgents();
  }, [showAgentFilter]);

  useEffect(() => {
    onSelectionChange?.(selectedRows);
  }, [onSelectionChange, selectedRows]);

  const toggleRow = (row: DataRow) => {
    setSelectedRows((current) =>
      current.includes(row)
        ? current.filter((selected) => selected !== row)
        : [...current, row]
    );
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
    setSelectedRows([]);
  };

  const handleExport = async () => {
    setExporting(true);
    const loadingToast = toast.loading("Preparing Excel report…");
    try {
      const params = new URLSearchParams({ export: "true" });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await fetch(`${endpoint}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      if (!response.ok) throw new Error("Export request failed");
      const data = await response.json();
      const exportData = data.results || data;
      if (!Array.isArray(exportData) || exportData.length === 0) {
        toast.error("There are no records to export");
        return;
      }

      if (exportVariant === "healthcare-commissions") {
        await exportHealthcareCommissions(
          exportData,
          columns,
          exportReportTitle || "Healthcare Commissions"
        );
      } else {
        const formatted = exportData.map((row: DataRow) =>
          Object.fromEntries(
            columns.map((column) => [
              column.label,
              typeof row[column.key] === "object"
                ? JSON.stringify(row[column.key])
                : row[column.key] ?? "",
            ])
          )
        );
        const worksheet = XLSX.utils.json_to_sheet(formatted);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(
          workbook,
          `${title || "Report"}_${new Date().toISOString().slice(0, 10)}.xlsx`
        );
      }
      toast.success("Excel report downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Unable to create the Excel report");
    } finally {
      toast.dismiss(loadingToast);
      setExporting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          <p className="mt-1 text-sm text-slate-500">
            {totalCount.toLocaleString()} record{totalCount === 1 ? "" : "s"}
            {activeFilterCount > 0 && ` · ${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0c477d] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#093a68] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {exporting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <FiDownload />
          )}
          {exporting ? "Preparing…" : "Export Excel"}
        </button>
      </div>

      <div className="border-b border-slate-100 bg-slate-50/70 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          <FiFilter />
          Report filters
        </div>
        <div className="flex flex-wrap items-end gap-3">
          {showAgentFilter && (
            <div className="min-w-[220px] flex-1 sm:max-w-[280px]">
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Broker or agent</label>
              <Select<AgentOption>
                options={agents}
                isSearchable
                isClearable
                placeholder="All brokers"
                value={agents.find((agent) => agent.value === filters.broker_name) || null}
                onChange={(option) => {
                  setFilters((current) => ({ ...current, broker_name: option?.value || "" }));
                  setPage(1);
                }}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: 40,
                    borderRadius: 10,
                    borderColor: state.isFocused ? "#93c5fd" : "#cbd5e1",
                    boxShadow: state.isFocused ? "0 0 0 3px #dbeafe" : "none",
                  }),
                  menu: (base) => ({ ...base, zIndex: 40 }),
                }}
              />
            </div>
          )}

          {columns.slice(0, 3).map((column) => (
            <div key={column.key} className="min-w-[180px] flex-1 sm:max-w-[230px]">
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                {column.label}
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={filters[column.key] || ""}
                  onChange={(event) => {
                    setFilters((current) => ({ ...current, [column.key]: event.target.value }));
                    setPage(1);
                  }}
                  placeholder={`Search ${column.label.toLowerCase()}`}
                  className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>
          ))}

          {showDateFilter && exactDateKey && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Exact date</label>
              <input
                type="date"
                value={filters[exactDateKey] || ""}
                onChange={(event) => {
                  setFilters((current) => ({
                    ...current,
                    [exactDateKey]: event.target.value,
                    start_date: "",
                    end_date: "",
                  }));
                  setPage(1);
                }}
                className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              />
            </div>
          )}

          {showDateFilter && (
            <>
              {[
                { key: "start_date", label: "From" },
                { key: "end_date", label: "To" },
              ].map((dateFilter) => (
                <div key={dateFilter.key}>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    {dateFilter.label}
                  </label>
                  <input
                    type="date"
                    value={filters[dateFilter.key] || ""}
                    onChange={(event) => {
                      setFilters((current) => {
                        const next = { ...current, [dateFilter.key]: event.target.value };
                        if (exactDateKey) delete next[exactDateKey];
                        return next;
                      });
                      setPage(1);
                    }}
                    className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              ))}
            </>
          )}

          <button
            onClick={clearFilters}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <FiRefreshCw />
            Reset
          </button>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="flex flex-wrap gap-3 border-b border-blue-100 bg-blue-50 px-5 py-3">
          <span className="rounded-lg bg-[#0c477d] px-3 py-2 text-xs font-semibold text-white">
            {selectedRows.length} selected
          </span>
          {["receipted_amount", "available_allocation", "commission_payable"].map((key) => (
            <div key={key} className="rounded-lg border border-blue-100 bg-white px-3 py-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {key.replaceAll("_", " ")}
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {(summaryTotals[key] || 0).toLocaleString("en-KE", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
              {displayCheckBoxes && (
                <th className="w-14 px-5 py-4">
                  <input
                    type="checkbox"
                    aria-label="Select all records"
                    checked={rows.length > 0 && selectedRows.length === rows.length}
                    onChange={(event) => setSelectedRows(event.target.checked ? rows : [])}
                    className="h-4 w-4 rounded border-slate-300 accent-[#0c477d]"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th key={column.key} className="whitespace-nowrap px-5 py-4 font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={columns.length + (displayCheckBoxes ? 1 : 0)} className="px-5 py-3">
                    <div className="h-8 animate-pulse rounded-lg bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (displayCheckBoxes ? 1 : 0)}
                  className="px-6 py-16 text-center"
                >
                  <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-400">
                    <FiSearch />
                  </div>
                  <p className="mt-3 font-semibold text-slate-700">No records found</p>
                  <p className="mt-1 text-sm text-slate-500">Adjust or reset the report filters.</p>
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="transition hover:bg-blue-50/45">
                  {displayCheckBoxes && (
                    <td className="px-5 py-3.5">
                      <input
                        type="checkbox"
                        aria-label={`Select record ${index + 1}`}
                        checked={selectedRows.includes(row)}
                        onChange={() => toggleRow(row)}
                        className="h-4 w-4 rounded border-slate-300 accent-[#0c477d]"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`whitespace-nowrap px-5 py-3.5 ${
                        moneyKeys.has(column.key)
                          ? "text-right font-medium tabular-nums text-slate-800"
                          : "text-slate-600"
                      }`}
                    >
                      {column.render
                        ? column.render(row)
                        : formatCellValue(column.key, row[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!hidePagination && (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-800">{page}</span> of{" "}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronLeft />
              Previous
            </button>
            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0c477d] px-3 text-sm font-medium text-white transition hover:bg-[#093a68] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
