import Tables from "@/src/components/Tables";

export default function Commissions(){

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Tables
                title="Commissions"
                endpoint={`${process.env.NEXT_LOCALHOST_API_URL}/commissions/records/`}
                columns={[
                    { key: "dr_cr_note_number", label: "Debit Note" },
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
