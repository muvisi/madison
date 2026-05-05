"use client";

import { useState } from "react";
import Tables from "@/src/components/Tables";

export default function PaidPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  

  
  const handlePay = async () => {
    console.log("SELECTED DATA:", selectedRows);

    if (selectedRows.length === 0) return;

    // try {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/pay/submit/`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         data: selectedRows, 
    //       }),
    //     }
    //   );

    //   if (!res.ok) throw new Error("Failed");

    //   console.log("Success");
    // } catch (err) {
    //   console.error("Error sending data", err);
    // }
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


      {/* TABLE */}
      <Tables
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/pay/`}
        hidePagination 
        title={""} 
        displayCheckBoxes
        onSelectionChange={(rows: any[]) => setSelectedRows(rows)}
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


    </div>
  );
}