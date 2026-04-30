import ReportTable from "@/src/components/ReportTable";

export default function Commissions(){

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ReportTable
                title="Commissions"
                // endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/copay/`}
                endpoint={`${process.env.NEXT_LOCALHOST_API_URL}/commissions/records/`}
                columns={[
                    { key: "push_note_code", label: "Push Note Code" },
                    { key: "dr_cr_note_number", label: "Debit/Credit Note" },
                    { key: "policy_number", label: "Policy Number" },
                    { key: "transaction_number", label: "Transaction Number" },
                    { key: "intermediary_name", label: "Intermediary Name" },
                    { key: "broker_name", label: "Broker Name" },
                    { key: "commission_amount", label: "Commission Amount" },
                    { key: "transaction_total_amount", label: "Transaction Total" }
                ]}
            />
        </div>
    );

}
