import Tables from "@/src/components/Tables";

export default function Commissions(){

    return (
        <div className="min-h-screen bg-gray-50 p-6">
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
        </div>
    );
}