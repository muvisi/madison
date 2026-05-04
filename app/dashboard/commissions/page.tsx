"use client";
import { useState } from "react";
import Tables from "@/src/components/Tables";

export default function Commissions() {
    const [activeTab, setActiveTab] = useState("payable");

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button
                    onClick={() => setActiveTab("payable")}
                    className={`px-4 py-2 ${
                        activeTab === "payable"
                            ? "border-b-2 border-blue-500 font-semibold"
                            : "text-gray-500"
                    }`}
                >
                    Commissions Payable
                </button>

                <button
                    onClick={() => setActiveTab("other")}
                    className={`px-4 py-2 ${
                        activeTab === "other"
                            ? "border-b-2 border-blue-500 font-semibold"
                            : "text-gray-500"
                    }`}
                >
              Commissions
                </button>
            </div>

            {/* Tab 1 */}
            {activeTab === "payable" && (
                <Tables
                    title="Commissions Payable"
                    endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/records/`}
                    showDateFilter={true}
                    exactDateKey="push_note_request_date"
                    columns={[
                        { key: "dr_cr_note_number", label: "Debit Note" },
                        { key: "push_note_request_date", label: "Push Note Date" },
                        { key: "policy_number", label: "Policy Number" },
                        { key: "intermediary_name", label: "Intermediary Name" },
                        { key: "broker_name", label: "Broker Name" },
                        { key: "intermediary_commission_rate", label: "Commission Rate" },
                        { key: "intermediary_with_holding_tax_rate", label: "Withholding tax rate" },
                        { key: "commission_amount", label: "Commission Amount" },
                        { key: "transaction_total_amount", label: "Transaction Total" }
                    ]}
                />
            )}

            {/* Tab 2 */}
            {activeTab === "other" && (
                <Tables
                    title="Table"
                    endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commisions/records/`}
                    columns={[
                        { key: "dr_cr_note_number", label: "Debit Note" },
                        { key: "push_note_request_date", label: "Push Note Date" },
                        { key: "policy_number", label: "Policy Number" },
                        { key: "intermediary_name", label: "Intermediary Name" },
                        { key: "broker_name", label: "Broker Name" },
                        { key: "intermediary_commission_rate", label: "Commission Rate" },
                        { key: "intermediary_with_holding_tax_rate", label: "Withholding tax rate" },
                        { key: "commission_amount", label: "Commission Amount" },
                        { key: "transaction_total_amount", label: "Transaction Total" },
                        { key: "sap_payment_ref", label: "Payment Reference" },
                        { key: "sap_payment_clientname", label: "Payment Reference" },
                        { key: "sap_payment_amount", label: "Payment Amount" },
                        { key: "sap_payment_allocateamount", label: "Payment Allocated Amount" },
                        { key: "primarybenefitname", label: "Primary Benefit name" }

                    ]}
                />
            )}
        </div>
    );
}