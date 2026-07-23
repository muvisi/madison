"use client";

import { useEffect, useState } from "react";
import Datatable, { Column, LouReport } from "@/src/components/Datatable";
import ReportFilters, { FilterField } from "@/src/components/ReportFilters";
import { LOU_STATUS, LOU_STATUSES } from "@/src/constants/lou-status";

const filterFields: FilterField[] = [
  {
    key: "memberNumber",
    placeholder: "Member Number",
    type: "text",
  },
  {
    key: "customer",
    placeholder: "Customer",
    type: "text",
  },
  {
    key: "providerName",
    placeholder: "Provider",
    type: "text",
  },
  {
    key: "admissionStatus",
    placeholder: "LOU Status",
    type: "select",
    options: LOU_STATUSES,
  },
  {
    key: "dateAuthorisedStartDate",
    placeholder: "Date Authorized",
    type: "date",
  },
  {
    key: "dateAuthorisedEndDate",
    placeholder: "Date Discharged",
    type: "date",
  },
];

const columns: Column<LouReport>[] = [

  {
  key: "admissionStatus",
  label: "LOU Status",
  render: (value) => (
    <span
      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium text-white ${
        value === LOU_STATUS.ADMITTED
          ? "bg-green-600"
          : value === LOU_STATUS.DAY_CASE
          ? "bg-blue-600"
          : value === LOU_STATUS.DISCHARGED
          ? "bg-gray-600"
          : value === LOU_STATUS.SCHEDULED
          ? "bg-yellow-500"
          : "bg-gray-500"
      }`}
    >
      {String(value)}
    </span>
  ),
},
   {
    key: "customerName",
    label: "Customer",
  },
   {
    key: "memberName",
    label: "Member Name",
  },
    {
    key: "memberNumber",
    label: "Member No",
  },
  {
    key: "referenceNumber",
    label: "Reference No",
  },

  {
    key: "providerName",
    label: "Provider Name",
  },
  {
    key: "benefit",
    label: "Benefit",
  },
 
  {
    key: "dateAuthorised",
    label: "Date Authorised",
  },
  {
    key: "dischargeDate",
    label: "Discharge Date",
  },
  {
    key: "lengthOfStay",
    label: "Length of Stay",
  },
   {
    key: "diagnosisName",
    label: "Diagnosis",
  },
    {
    key: "louNotes",
    label: "LOU Notes",
  },
  {
    key: "reserveAmount",
    label: "Reserve Amount",
    render: (value) =>
      new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(Number(value)),
  },
  {
    key: "discountAmount",
    label: "Discount Amount",
    render: (value) =>
      new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(Number(value)),
  },
  {
    key: "shashifType",
    label: "SHA/SHIF Type",
  },
  {
    key: "louShashifAmount",
    label: "SHA/SHIF Amount",
    render: (value) =>
      new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(Number(value)),
  },

];

export default function LouStatusReport() {
  const [louReports, setLouReports] = useState<LouReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    memberNumber: "",
    customer: "",
    providerName: "",
    admissionStatus: "",
    dateAuthorised: "",
    dischargeDate: "",
  
  });


 const loadLouStatusReport = async (
  pageNumber: number,
  filterValues = filters
) => {
  setLoading(true);
  setSearching(true);

  try {
    const params = new URLSearchParams();

    params.append("page", pageNumber.toString());
    params.append("pageSize", "10");

    Object.entries(filterValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/care-management/lou-status-report?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to load LOU Status Report");
    }

    const data = await response.json();

    setLouReports(data.items);
    setTotalPages(data.totalPages);
  } catch (error) {
    console.error(error);
    setLouReports([]);
    setTotalPages(1);
  } finally {
    setLoading(false);
    setSearching(false);
    setExporting(false);
  }
};

  useEffect(() => {
    loadLouStatusReport(page);
  }, [page]);

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    setPage(1);
    loadLouStatusReport(1);
  };

  const handleReset = () => {
    const resetFilters = {
    memberNumber: "",
    customer: "",
    providerName: "",
    admissionStatus: "",
    dateAuthorised: "",
    dischargeDate: "",

    };

    setFilters(resetFilters);
    setPage(1);
    loadLouStatusReport(1, resetFilters);
  };


const handleExport = async () => {
  setExporting(true);

  try {
    const params = new URLSearchParams();

    params.append("export", "true");

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/care-management/lou-status-report?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to generate report");
    }

    const result = await response.json();

    if (!result.downloadUrl) {
      throw new Error("Download URL not returned.");
    }

    if (result.totalItems === 0) {
      alert("There are no records to export.");
      return;
    }

    const now = new Date();

    const exportDate = now.toISOString().split("T")[0];
    const exportTime = now.toTimeString().split(" ")[0].replace(/:/g, "-");

    let fileName = "LOU Status Report";

    if (filters.dateAuthorised && filters.dischargeDate) {
      fileName += ` (${filters.dateAuthorised} to ${filters.dischargeDate})`;
    } else if (filters.dateAuthorised) {
      fileName += ` (Authorised ${filters.dateAuthorised})`;
    } else if (filters.dischargeDate) {
      fileName += ` (Discharged ${filters.dischargeDate})`;
    }

    fileName += ` - Exported ${exportDate} ${exportTime}.xlsx`;

    const link = document.createElement("a");
    link.href = result.downloadUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error(error);
    alert("Failed to export report.");
  } finally {
    setExporting(false);
  }
};

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">
      LOU Status Report
    </h2>
   
      <ReportFilters
        fields={filterFields}
        values={filters}
        onChange={handleChange}
        onSearch={handleSearch}
        onReset={handleReset}
        onExport={handleExport}
        searching={searching}
        exporting={exporting}
      />

      <div className="mx-auto max-w-8xl overflow-x-auto rounded-lg border bg-white p-4 shadow">
        <Datatable
          columns={columns}
          data={louReports}
          loading={loading}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}