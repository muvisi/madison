import Pagination from "@/src/components/Pagination";
import LoadingSpinner from "./LoadingSpinner";

export type Column<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "center" | "right";
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface LouReport {
  admissionStatus: string;
  customerName: string;
  memberName: string;
  memberNumber: string;
  referenceNumber: string;
  providerName: string;
  benefit: string;
  dateAdmitted:string
  dateAuthorised: string;
  dischargeDate: string;
  lengthOfStay: number;
  diagnosisName: string;
  louNotes: string;
  reserveAmount: number;
  discountAmount: number;
  shashifType: string;
  louShashifAmount: number;
}

export interface FollowUpReport {

  caseLouCode: number
  admissionStatus: string
  corporate: string
  memberName: string
  memberNumber: string
  referenceNumber: string
  providerName: string
  benefit: string
  dateAdmitted: string
  dateAuthorised: string
  amountAuthorised: number
  dischargeDate: string
  lengthOfStay: number
  diagnosisName: string
  louNotes: string
  currentActiveManagement: string
  notes: string
  exclusionOrNonPayables: string
  interimBill: number
  followUpDate: string
  followUpType: string

}

export default function DataTable<T>({
  columns,
  data,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <div className="mx-auto max-w-8xl">
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
        <div className="max-h-150 overflow-auto">
          <table className="min-w-max border-collapse text-sm">
            {/* Header */}
            <thead className="sticky top-0 bg-blue-700 text-white">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`border border-blue-800 px-4 py-3 font-semibold whitespace-nowrap ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
         

            <tbody>
  {loading ? (
    <tr>
      <td
        colSpan={columns.length}
        className="border border-gray-200 py-10"
      >
        <LoadingSpinner text="Loading ..." />
      </td>
    </tr>
  ) : data.length > 0 ? (
    data.map((row, rowIndex) => (
      <tr
        key={rowIndex}
        className={`transition-colors hover:bg-blue-50 ${
          rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
        }`}
      >
        {columns.map((column) => (
          <td
            key={String(column.key)}
            className={`border border-gray-200 px-4 py-3 whitespace-nowrap ${
              column.align === "center"
                ? "text-center"
                : column.align === "right"
                ? "text-right"
                : "text-left"
            }`}
          >
            {column.render
              ? column.render(row[column.key], row)
              : String(row[column.key] ?? "")}
          </td>
        ))}
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan={columns.length}
        className="border border-gray-200 py-10 text-center text-gray-500"
      >
        No records found.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}