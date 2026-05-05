"use client";

import { useState } from "react";
import Tables from "@/src/components/Tables";

export default function PaidPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (tableData.length === 0) return;

    const allSelected = tableData.every((r) =>
      selectedRows.includes(r.push_note_code)
    );

    setSelectedRows(
      allSelected ? [] : tableData.map((r) => r.push_note_code)
    );
  };

  const handlePay = () => {
    console.log("PAY:", selectedRows);
  };

  return (
    <div className="overflow-x-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Pay Commissions</h2>

        <button
          onClick={handlePay}
          disabled={selectedRows.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Pay Selected ({selectedRows.length})
        </button>
      </div>

      {/* SELECT ALL */}
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
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/pay/`}
        hidePagination
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
        ]}
      />

      {/* CHECKBOX COLUMN */}
      <div className="absolute left-0 top-[120px] w-10">
        {tableData.map((row) => (
          <div key={row.push_note_code} className="h-[40px] flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedRows.includes(row.push_note_code)}
              onChange={() => toggleRow(row.push_note_code)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}