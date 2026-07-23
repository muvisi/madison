"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiCreditCard, FiLock } from "react-icons/fi";
import Tables from "@/src/components/Tables";
import { getAccessToken } from "@/src/services/auth";
import { useAccess } from "@/src/services/access";

type CommissionRow = Record<string, unknown> & { debit_code?: string };

export default function PayCommissionsPage() {
  const [selectedRows, setSelectedRows] = useState<CommissionRow[]>([]);
  const [processing, setProcessing] = useState(false);
  const isFinance = useAccess("finance");

  const handlePay = async () => {
    if (selectedRows.length === 0) return;
    if (
      !window.confirm(
        `Authorize payment for ${selectedRows.length} selected commission record${selectedRows.length === 1 ? "" : "s"}?`
      )
    ) {
      return;
    }

    setProcessing(true);
    const loadingToast = toast.loading("Authorizing commission payments…");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/authorize/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify({
            data: selectedRows.map((row) => ({ debit_code: row.debit_code })),
          }),
        }
      );
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (!response.ok) throw new Error(data?.error || "Payment authorization failed");

      toast.success("Commission payments authorized successfully");
      setTimeout(() => window.location.reload(), 900);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment authorization failed");
    } finally {
      toast.dismiss(loadingToast);
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-lg text-emerald-700">
            <FiCreditCard />
          </span>
          <div>
            <h3 className="font-semibold text-slate-900">Payment Authorization Queue</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Select eligible records, review calculated values, and authorize broker commission payments.
            </p>
          </div>
        </div>

        {isFinance ? (
          <button
            onClick={handlePay}
            disabled={selectedRows.length === 0 || processing}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {processing ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <FiLock />
            )}
            {processing
              ? "Authorizing…"
              : `Authorize payment${selectedRows.length ? ` (${selectedRows.length})` : ""}`}
          </button>
        ) : (
          <span className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-700">
            Finance authorization required
          </span>
        )}
      </div>

      <Tables
        endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/pay/`}
        hidePagination
        title="Eligible commissions"
        exportVariant="healthcare-commissions"
        displayCheckBoxes
        showDateFilter
        exactDateKey="sap_payment_receiptdate"
        showAgentFilter
        onSelectionChange={(rows) => setSelectedRows(rows as CommissionRow[])}
        columns={[
          { key: "push_note_code", label: "Push Note" },
          { key: "debit_code", label: "Debit Note" },
          { key: "payment_status", label: "Status" },
          { key: "policy_number", label: "Policy" },
          { key: "customer_name", label: "Customer" },
          { key: "broker_name", label: "Broker / Agent" },
          { key: "receipted_amount", label: "Receipted" },
          { key: "available_allocation", label: "Allocation" },
          { key: "broker_commission", label: "Commission" },
          { key: "withholding_tax", label: "WHT" },
          { key: "commission_payable", label: "Payable" },
          { key: "sap_receipt_number", label: "Receipt Number" },
          { key: "sap_payment_receiptdate", label: "Receipt Date" },
        ]}
      />
    </div>
  );
}
