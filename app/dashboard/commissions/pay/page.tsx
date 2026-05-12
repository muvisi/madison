"use client";

import { useState } from "react";
import Tables from "@/src/components/Tables";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function PaidPage() {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error" | ""; message: string }>({
    type: "",
    message: "",
  });

  // ✅ TOAST HANDLER
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast({ type: "", message: "" });
    }, 3000);
  };

  // ✅ PAY SELECTED → BACKEND
  const handlePay = async () => {
    if (selectedRows.length === 0) return;

    setLoading(true);

    try {
      const payload = {
        data: selectedRows.map((row) => ({
          debit_code: row.debit_code,
        })),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/authorize/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

  

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Payment failed");
      }


      showToast("success", "💰 Payments processed successfully!");

      // optional refresh
      setTimeout(() => window.location.reload(), 1200);
    } catch (err: any) {
      console.error("PAYMENT ERROR:", err.message);
      showToast("error", err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-x-auto p-4">

      {/* 🔥 TOAST NOTIFICATIONS */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-3 rounded shadow-lg text-white text-sm transition-all  z-[9999] ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="mb-4">
        <Link
          href="/dashboard/commissions"
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded flex items-center gap-2 inline-flex"
        >
          ← Back to dashboard
        </Link>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Pay Commissions</h2>

        <button
          onClick={handlePay}
          disabled={selectedRows.length === 0 || loading}
          className={`px-4 py-2 rounded text-white flex items-center gap-2 transition ${
            loading || selectedRows.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              Processing...
            </>
          ) : (
            `Pay Selected (${selectedRows.length})`
          )}
        </button>
      </div>

      {/* TABLE */}
      <Tables
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/pay/`}
        hidePagination
        title={""}
        displayCheckBoxes
        showDateFilter
        exactDateKey="receipt_date"
        onSelectionChange={(rows: any[]) => setSelectedRows(rows)}
        columns={[
          { key: "push_note_code", label: "Push Note" },
          { key: "debit_code", label: "Debit Note" },
          { key: "payment_status", label: "Status" },
          { key: "policy_number", label: "Policy" },
          { key: "customer_name", label: "Customer" },
          { key: "broker_name", label: "Broker" },
          { key: "receipted_amount", label: "Receipted" },
          { key: "available_allocation", label: "Allocation" },
          { key: "broker_commission", label: "Broker Comm" },
          { key: "withholding_tax", label: "WHT" },
          { key: "commission_payable", label: "Payable" },
          { key: "receipt_date", label: "Receipt Date" },
        ]}
      />
    </div>
  );
}