"use client";

import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { getAccessToken } from "@/src/services/auth";
import * as XLSX from "xlsx";
import Select from "react-select";

interface ReportTableProps {
    title: string;
    endpoint: string;
    // columns: { key: string; label: string }[];
    columns: {
    key: string;
    label: string;
    render?: (row: any) => React.ReactNode;
}[];
    showDateFilter?: boolean;
    exactDateKey?: string;
    displayCheckBoxes?: boolean; 
    transform?: (data: any[]) => any[];
    hidePagination?: boolean;
    showAgentFilter?: boolean;
    onSelectionChange?: (rows: any[]) => void;
    render?: (row: any) => React.ReactNode; 

}

interface AgentOption {
    value: string;
    label: string;
}

export default function ReportTable({ title, endpoint, columns, showDateFilter, exactDateKey, displayCheckBoxes, hidePagination, onSelectionChange,showAgentFilter}: ReportTableProps) {
    const [rows, setRows] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<{ [key: string]: string }>({});

    // Pagination States
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 20; 
    const [exporting, setExporting] = useState(false);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [agents, setAgents] = useState<AgentOption[]>([]);


    const summaryTotals = useMemo(() => {
        return selectedRows.reduce(
            (acc, row: any) => {
                acc.receipted_amount += Number(row.receipted_amount) || 0;
                acc.available_allocation += Number(row.available_allocation) || 0;
                acc.broker_commission += Number(row.broker_commission) || 0;
                acc.withholding_tax += Number(row.withholding_tax) || 0;
                acc.commission_payable += Number(row.commission_payable) || 0;
                return acc;
            },
            {
                receipted_amount: 0,
                available_allocation: 0,
                broker_commission: 0,
                withholding_tax: 0,
                commission_payable: 0,
            }
        );
    }, [selectedRows]);

    const toggleRow = (row: any) => {
    setSelectedRows((prev) =>
        prev.some((r) => r === row)
            ? prev.filter((r) => r !== row)
            : [...prev, row]
    );
   };

   const toggleAll = (checked: boolean) => {
    if (checked) {
        setSelectedRows(rows as any[]);
    } else {
        setSelectedRows([]);
    }
};



    const fetchData = async () => {
        setLoading(true);
        try {
       

            const params = new URLSearchParams();

            params.append("page", String(page));

            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const token = getAccessToken();

            const res = await fetch(`${endpoint}?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            });


            if (!res.ok) {
                const errorText = await res.text();
                console.log("API ERROR:", errorText);
                toast.error("Failed to fetch data");
                return;
            }

            const data = await res.json();

            setRows(data.results || data || [] );
            setTotalCount(data.count || data.pagination?.count || 0);
        } catch (_err) {
            console.error(_err);
            toast.error("Failed to fetch data");
            setRows([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    // Reset page when filters change

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/commisions/getagentbrokers/`, {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch agents");
                }

                const data = await res.json();
                const items = data.results || data || []; 

                console.log("Fetched agents:", items);

                setAgents(
                    (items as any[])
                        .map((agent) => ({
                            value: String(agent.agentbrokername ?? ""),
                            label: String(agent.agentbrokername ?? ""),
                        }))
                        .filter((agent) => agent.value && agent.label)
                );
            } catch (_err) {
                console.error(_err);
                toast.error("Failed to load agents");
            }
        };

        fetchAgents();
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, filters]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
        setSelectedRows([]);
    }, [filters]);

 

useEffect(() => {
    if (onSelectionChange) {
        onSelectionChange(selectedRows);
        console.log("Selected rows:", selectedRows);
    }
}, [selectedRows]);

    const handleExport = async () => {
        setExporting(true);
        const loadingToast = toast.loading("Exporting data...");
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            params.append("export", "true");

            const res = await fetch(`${endpoint}?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to export data");
            }

            const data = await res.json();
            const exportData = data.results || data;

            if (!Array.isArray(exportData) || exportData.length === 0) {
                toast.error("No data available to export");
                return;
            }

            const exportTotals = exportData.reduce(
                (acc: Record<string, number>, row: any) => {
                    acc.receipted_amount += Number(row.receipted_amount) || 0;
                    acc.available_allocation += Number(row.available_allocation) || 0;
                    acc.broker_commission += Number(row.broker_commission) || 0;
                    acc.withholding_tax += Number(row.withholding_tax) || 0;
                    acc.commission_payable += Number(row.commission_payable) || 0;
                    return acc;
                },
                {
                    receipted_amount: 0,
                    available_allocation: 0,
                    broker_commission: 0,
                    withholding_tax: 0,
                    commission_payable: 0,
                }
            );

            // Map data to match columns
            const formattedData = exportData.map((row: any) => {
                const newRow: Record<string, any> = {};
                columns.forEach((col) => {
                    newRow[col.label] = typeof row[col.key] === "object" ? JSON.stringify(row[col.key]) : row[col.key] || "-";
                });
                return newRow;
            });

            const totalsRow: Record<string, any> = {};
            columns.forEach((col, idx) => {
                if (idx === 0) {
                    totalsRow[col.label] = "Totals";
                    return;
                }

                switch (col.key) {
                    case "receipted_amount":
                        totalsRow[col.label] = exportTotals.receipted_amount.toLocaleString();
                        break;
                    case "available_allocation":
                        totalsRow[col.label] = exportTotals.available_allocation.toLocaleString();
                        break;
                    case "broker_commission":
                        totalsRow[col.label] = exportTotals.broker_commission.toLocaleString();
                        break;
                    case "withholding_tax":
                        totalsRow[col.label] = exportTotals.withholding_tax.toLocaleString();
                        break;
                    case "commission_payable":
                        totalsRow[col.label] = exportTotals.commission_payable.toLocaleString();
                        break;
                    default:
                        totalsRow[col.label] = "";
                }
            });

            const worksheet = XLSX.utils.json_to_sheet([...formattedData, totalsRow]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Export");
            XLSX.writeFile(workbook, `${title}_Export_${new Date().toISOString().split("T")[0]}.xlsx`);

            toast.success("Export successful!");
        } catch (_err) {
            console.error(_err);
            toast.error("An error occurred during export");
        } finally {
            toast.dismiss(loadingToast);
            setExporting(false);
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="p-4 w-full max-w-8xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
          Total Records: <strong>{totalCount}</strong>
        </span>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 flex-wrap bg-white p-3 rounded-lg border shadow-sm items-end">
                
                  {showAgentFilter && (
                <div className="w-full sm:w-48">
            <Select<AgentOption>
                options={agents}
                isSearchable
                isClearable
                placeholder="Select Agent"
                
                value={
                    agents.find(
                        (agent) =>
                            agent.value === filters.broker_name
                    ) || null
                }
                onChange={(selectedOption) => {
                    setFilters((prev) => ({
                        ...prev,
                        broker_name: selectedOption?.value || "",
                    }));
                }}
            />
        </div>
           )}
                {columns.slice(0, 4).map((col) => (
                    <div key={col.key} className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1 opacity-0 hidden sm:block">Filter</label>
                        <input
                            placeholder={`Filter ${col.label}`}
                            value={filters[col.key] || ""}
                            onChange={(e) => {
                                setFilters((prev) => ({ ...prev, [col.key]: e.target.value }));
                            }}
                            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48"
                        />
                    </div>
                ))}

                {showDateFilter && exactDateKey && (
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1">Exact Date</label>
                        <input
                            type="date"
                            value={filters[exactDateKey] || ""}
                            onChange={(e) => {
                                setFilters((prev) => ({ ...prev, [exactDateKey]: e.target.value, start_date: "", end_date: "" }));
                            }}
                            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-36"
                        />
                    </div>
                )}

                {showDateFilter && (
                    <>
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={filters.start_date || ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFilters((prev) => {
                                        const newFilters: Record<string, string> = { ...prev, start_date: val };
                                        if (exactDateKey) delete newFilters[exactDateKey];
                                        return newFilters;
                                    });
                                }}
                                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-36"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1">End Date</label>
                            <input
                                type="date"
                                value={filters.end_date || ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFilters((prev) => {
                                        const newFilters: Record<string, string> = { ...prev, end_date: val };
                                        if (exactDateKey) delete newFilters[exactDateKey];
                                        return newFilters;
                                    });
                                }}
                                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-36"
                            />
                        </div>
                    </>
                )}

                <button
                    onClick={() => setFilters({})}
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded text-sm font-medium transition-colors h-8.5 self-end"
                >
                    Clear
                </button>
                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors h-8.5 self-end disabled:opacity-50"
                >
                    {exporting ? "Exporting..." : "Export to Excel"}
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="p-20 text-center text-gray-400 animate-pulse">Loading data...</div>
            ) : (
                <div className="overflow-x-auto border rounded-xl bg-white shadow-sm">
                    <table className="w-full text-sm text-left">
                               <thead className="whitespace-nowrap bg-blue-600 text-white font-medium">
                        <tr>

                            {displayCheckBoxes && (
                                <th className="p-3">
                                    <div className="flex items-center gap-2">
      <input
    type="checkbox"
    checked={
        rows.length > 0 &&
        selectedRows.length === rows.length
    }
    onChange={(e) => toggleAll(e.target.checked)}
/>
        <span className="text-sm">Select All</span>
    </div>
                                   
                                </th>

                                
                            )}

                            {columns.map((col) => (
                                <th key={col.key} className="p-4 border-b border-blue-500">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        {/* <thead className=" whitespace-nowrap bg-blue-600 text-white font-medium">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} className="p-4 border-b border-blue-500">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                        </thead> */}
                        <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-10 text-center text-gray-500">
                                    No data found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row: Record<string, unknown>, idx: number) => (
                                <tr key={idx} className="border-b last:border-0 hover:bg-blue-50 transition-colors">

                                    {displayCheckBoxes && (
                                        <td className="p-4 text-gray-700">
                                      <input
    type="checkbox"
    checked={selectedRows.some(
        (r) => r.push_note_code === (row as any).push_note_code
    )}
    onChange={() => toggleRow(row)}
/>
                                        </td>
                                    )}

                                    {/* {columns.map((col) => (
                                            <td key={col.key} className="p-4 text-gray-700">
                                            {typeof row[col.key] === "object" ? JSON.stringify(row[col.key]) : (row[col.key] as string) || "-"}
                                        </td>
                                    ))} */}

                                    {columns.map((col) => (
  <td key={col.key} className="p-4 text-gray-700">
    {col.render
      ? col.render(row)
      : typeof row[col.key] === "object"
      ? JSON.stringify(row[col.key])
      : (row[col.key] as string) || "-"}
  </td>
))}
                                </tr>

                              
                            ))
                        )}
                        {selectedRows.length > 0 && (
                            <tr className="bg-blue-50 font-semibold text-gray-900">
                                {displayCheckBoxes && <td className="p-4" />}
                                {columns.map((col, idx) => {
                                    if (idx === 0) {
                                        return (
                                            <td key={col.key} className="p-4">
                                                Totals ({selectedRows.length})
                                            </td>
                                        );
                                    }

                                    switch (col.key) {
                                        case "receipted_amount":
                                            return (
                                                <td key={col.key} className="p-4">
                                                    {summaryTotals.receipted_amount.toLocaleString()}
                                                </td>
                                            );
                                        case "available_allocation":
                                            return (
                                                <td key={col.key} className="p-4">
                                                    {summaryTotals.available_allocation.toLocaleString()}
                                                </td>
                                            );
                                        case "broker_commission":
                                            return (
                                                <td key={col.key} className="p-4">
                                                    {summaryTotals.broker_commission.toLocaleString()}
                                                </td>
                                            );
                                        case "withholding_tax":
                                            return (
                                                <td key={col.key} className="p-4">
                                                    {summaryTotals.withholding_tax.toLocaleString()}
                                                </td>
                                            );
                                        case "commission_payable":
                                            return (
                                                <td key={col.key} className="p-4">
                                                    {summaryTotals.commission_payable.toLocaleString()}
                                                </td>
                                            );
                                        default:
                                            return (
                                                <td key={col.key} className="p-4 text-gray-500">-</td>
                                            );
                                    }
                                })}
                            </tr>
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