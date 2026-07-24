"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiCalendar, FiCheckCircle, FiCreditCard, FiLock } from "react-icons/fi";
import Tables from "@/src/components/Tables";
import { getAccessToken } from "@/src/services/auth";
import { useAccess } from "@/src/services/access";

type CommissionRow = Record<string, unknown> & { debit_code?: string };

const AUTHORIZATION_DAYS = new Set([1, 2, 15, 16]);

function getNairobiDate() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());

  return Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, Number(value)])
  ) as { year: number; month: number; day: number };
}

function getAuthorizationWindow() {
  const { year, month, day } = getNairobiDate();
  const isOpen = AUTHORIZATION_DAYS.has(day);

  let nextYear = year;
  let nextMonth = month;
  let nextDay = 15;

  if (day > 16) {
    nextMonth += 1;
    nextDay = 1;
    if (nextMonth === 13) {
      nextMonth = 1;
      nextYear += 1;
    }
  } else if (day <= 2) {
    nextDay = day;
  }

  const nextDate = new Intl.DateTimeFormat("en-KE", {
    timeZone: "Africa/Nairobi",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(nextYear, nextMonth - 1, nextDay, 12)));

  return { isOpen, nextDate };
}

export default function PayCommissionsPage() {
  const [selectedRows, setSelectedRows] = useState<CommissionRow[]>([]);
  const [processing, setProcessing] = useState(false);
  const isFinance = useAccess("finance");
  const authorizationWindow = getAuthorizationWindow();

  const showClosedWindowToast = () => {
    toast.custom(
      (notification) => (
        <div
          className={`flex max-w-md items-start gap-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-xl transition ${
            notification.visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
            <FiCalendar />
          </span>
          <div>
            <p className="font-semibold text-slate-900">Authorization window is closed</p>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              Payments can only be authorized on the 1st, 2nd, 15th, and 16th of each
              month. The next window opens on{" "}
              <span className="font-semibold text-amber-700">
                {authorizationWindow.nextDate}
              </span>
              .
            </p>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const handlePay = async () => {
    if (!getAuthorizationWindow().isOpen) {
      showClosedWindowToast();
      return;
    }
    if (selectedRows.length === 0) {
      toast("Select at least one commission record to continue.", { icon: "☝️" });
      return;
    }
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
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                authorizationWindow.isOpen
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {authorizationWindow.isOpen ? <FiCheckCircle /> : <FiCalendar />}
              {authorizationWindow.isOpen
                ? "Authorization window open today"
                : `Next authorization date: ${authorizationWindow.nextDate}`}
            </div>
          </div>
        </div>

        {isFinance ? (
          <button
            onClick={handlePay}
            disabled={processing}
            aria-disabled={!authorizationWindow.isOpen || selectedRows.length === 0}
            title={
              authorizationWindow.isOpen
                ? "Authorize selected commission payments"
                : "Payment authorization is available only on the 1st, 2nd, 15th, and 16th"
            }
            className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:bg-slate-300 ${
              authorizationWindow.isOpen
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "cursor-not-allowed border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            {processing ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <FiLock />
            )}
            {processing
              ? "Authorizing…"
              : !authorizationWindow.isOpen
                ? "Authorization closed"
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
