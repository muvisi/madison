"use client";

import { useState } from "react";
import Tables from "@/src/components/Tables";

const StatusBadge = ({ status }: { status?: string }) => {
  const normalized = status?.toLowerCase() || "";
  const base =
    "inline-flex items-center px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap";

  if (normalized.includes("fully"))
    return <span className={`${base} bg-green-100 text-green-700`}>✅ Fully Paid</span>;

  if (normalized.includes("partially"))
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>🕐 Partially Paid</span>;

  return <span className={`${base} bg-gray-100 text-gray-600`}>⚪ Unpaid</span>;
};

export default function Commissions() {
  const [activeTab, setActiveTab] =
    useState<"payable" | "status" | "paid">("payable");

  const tabs = [
    { key: "payable", label: "Debited Business" },
    { key: "status", label: "Debit Payment Status" },
    { key: "paid", label: "Pay Commissions" },
  ];

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  // 🔥 toggle single row
  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 🔥 select all (safe version)
  const toggleSelectAll = () => {
    if (tableData.length === 0) return;

    const allSelected = tableData.every((r) =>
      selectedRows.includes(r.push_note_code)
    );

    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tableData.map((r) => r.push_note_code));
    }
  };

  // 🔥 PAY HANDLER
  const handlePay = (rows: string[]) => {
    console.log("PAY THESE:", rows);
    // API call here
  };

  return (
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 lg:px-8 py-4 sm:py-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-10">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          Commission Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Track commission statements, payments, and allocation statuses.
        </p>
      </div>

      {/* CARD */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* TABS */}
        <div className="border-b bg-gray-50">
          <div className="flex gap-4 sm:gap-6 px-3 sm:px-6 py-3 overflow-x-auto whitespace-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-shrink-0 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-blue-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-3 sm:p-6">
          {/* PAYABLE */}
          {activeTab === "payable" && (
            <div className="overflow-x-auto">
              <Tables
                title="Commissions Payable"
                endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/records/`}
                showDateFilter
                exactDateKey="push_note_request_date"
                columns={[
                  { key: "dr_cr_note_number", label: "Debit Note" },
                  { key: "push_note_request_date", label: "Push Note Date" },
                  { key: "policy_number", label: "Policy Number" },
                  { key: "intermediary_name", label: "Intermediary" },
                  { key: "broker_name", label: "Broker" },
                  { key: "commission_amount", label: "Commission" },
                  { key: "transaction_total_amount", label: "Transaction" },
                ]}
              />
            </div>
          )}

          {/* STATUS */}
          {activeTab === "status" && (
            <div className="overflow-x-auto">
              <Tables
                title="Debit Payment Status"
                endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/debit-history`}
                transform={(data: any[]) =>
                  data.map((row) => ({
                    ...row,
                    payment_status: (
                      <StatusBadge status={row.payment_status} />
                    ),
                  }))
                }
                columns={[
                  { key: "push_note_code", label: "Push Note" },
                  { key: "policy_number", label: "Policy" },
                  { key: "intermediary_name", label: "Intermediary" },
                  { key: "broker_name", label: "Broker" },
                  { key: "receipted_amount", label: "Receipted" },
                  { key: "available_allocation", label: "Allocation" },
                  { key: "broker_commission", label: "Broker Comm" },
                  { key: "commission_payable", label: "Payable" },
                  { key: "transaction_total_amount", label: "Total" },
                  { key: "payment_status", label: "Status" },
                ]}
              />
            </div>
          )}

{/* PAID */}
{activeTab === "paid" && (
  <div className="overflow-x-auto">

    {/* HEADER */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
      <h2 className="text-lg font-semibold">Pay Commissions</h2>

      <button
        onClick={() => handlePay(selectedRows)}
        disabled={selectedRows.length === 0}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 w-full sm:w-auto"
      >
        Pay Selected ({selectedRows.length})
      </button>
    </div>

    {/* TABLE WRAPPER */}
    <div className="relative">

      {/* SELECT ALL (ABOVE TABLE BUT CONTROLLED BY ROWS) */}
      <div className="mb-2 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={
            tableData.length > 0 &&
            tableData.every((r) =>
              selectedRows.includes(r.push_note_code)
            )
          }
          onChange={toggleSelectAll}
        />
        <span>Select All</span>
      </div>

      {/* TABLE */}
      <Tables
        title=""
        hidePagination={true}
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/pay/`}
        onDataLoaded={(data: any[]) => setTableData(data)}
        columns={[
          { key: "push_note_code", label: "Push Note" },
          { key: "policy_number", label: "Policy" },
          { key: "broker_name", label: "Broker" },
          { key: "receipted_amount", label: "Receipted" },
          { key: "available_allocation", label: "Allocation" },
          { key: "broker_commission", label: "Broker Comm" },
          { key: "withholding_tax", label: "WHT" },
          { key: "commission_payable", label: "Payable" },
          { key: "payment_status", label: "Status" },
        ]}
      />

      {/* OVERLAY CHECKBOX COLUMN (SYNCED WITH ROWS) */}
      <div className="absolute left-0 top-0 h-full w-10 pointer-events-none">
        <div className="pt-10">
          {tableData.map((row) => (
            <div key={row.push_note_code} className="h-[40px] flex items-center justify-center pointer-events-auto">
              <input
                type="checkbox"
                checked={selectedRows.includes(row.push_note_code)}
                onChange={() => toggleRow(row.push_note_code)}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}