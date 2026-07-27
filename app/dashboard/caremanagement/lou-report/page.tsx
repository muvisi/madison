"use client";

import { useEffect, useState } from "react";
import Datatable, { Column, LouReport } from "@/src/components/Datatable";
import ReportFilters, { FilterField } from "@/src/components/ReportFilters";
import { LOU_STATUS, LOU_STATUSES } from "@/src/constants/lou-status";
import {
  getLouStatusReport,
  exportLouStatusReport,
} from "@/src/services/lou-status.service";
import TooltipText from "@/src/components/Tooltip";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const filterFields: FilterField[] = [
  {
    key: "memberNumber",
    placeholder: "Member Number",
    type: "text",
  },
  {
    key: "customerName",
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
      render: (value) => (
    <TooltipText text={String(value ?? "")} />
  ),
  },
    {
    key: "louNotes",
    label: "LOU Notes",
      render: (value) => (
    <TooltipText text={String(value ?? "")} />
  ),
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
    customerName: "",
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

  
    const data = await getLouStatusReport(params);

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
    customerName: "",
    providerName: "",
    admissionStatus: "",
    dateAuthorised: "",
    dischargeDate: "",

    };

    setFilters(resetFilters);
    setPage(1);
    loadLouStatusReport(1, resetFilters);
  };


// const handleExport = async () => {

//   setExporting(true);

//   try {
//     const params = new URLSearchParams();

//     params.append("export", "true");

//     Object.entries(filters).forEach(([key, value]) => {
//       if (value !== undefined && value !== null && value !== "") {
//         params.append(key, String(value));
//       }
//     });


//     const result = await exportLouStatusReport(params);

//     if (!result.downloadUrl) {
//       throw new Error("Download URL not returned.");
//     }

//     if (result.totalItems === 0) {
//       alert("There are no records to export.");
//       return;
//     }

//     const now = new Date();

//     const exportDate = now.toISOString().split("T")[0];
//     const exportTime = now.toTimeString().split(" ")[0].replace(/:/g, "-");

//     let fileName = "Daily Admissions Report";

//     if (filters.dateAuthorised && filters.dischargeDate) {
//       fileName += ` (${filters.dateAuthorised} to ${filters.dischargeDate})`;
//     } else if (filters.dateAuthorised) {
//       fileName += ` (Authorised ${filters.dateAuthorised})`;
//     } else if (filters.dischargeDate) {
//       fileName += ` (Discharged ${filters.dischargeDate})`;
//     }

//     fileName += ` - Exported ${exportDate} ${exportTime}.xlsx`;

//     const link = document.createElement("a");
//     link.href = result.downloadUrl;
//     link.download = fileName;

//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   } catch (error) {
//     console.error(error);
//     alert("Failed to export report.");
//   } finally {
//     setExporting(false);
//   }
// };

const handleExport = async () => {
  setExporting(true);

  const loadingToast = toast.loading("Preparing Excel report...");

  try {
    const params = new URLSearchParams();

    params.append("export", "true");

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const result = await exportLouStatusReport(params);

    const exportData = result.items ?? [];

    if (exportData.length === 0) {
      toast.error("There are no records to export.");
      return;
    }

    const formattedData = exportData.map((row: any) =>
      Object.fromEntries(
        columns.map((column) => {
          let value = row[column.key];

          if (typeof value === "string") {
            value = value.trim();
          }

          return [
            column.label,
            value === null || value === undefined
              ? ""
              : typeof value === "object"
              ? JSON.stringify(value)
              : value,
          ];
        })
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Auto-size columns
    worksheet["!cols"] = columns.map((column) => ({
      wch:
        Math.max(
          column.label.length,
          ...formattedData.map((row: any) =>
            String(row[column.label as keyof typeof row] ?? "").length
          )
        ) + 2,
    }));

  

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Daily Admissions Report"
    );

    const now = new Date();

    const exportDate = now.toISOString().split("T")[0];
    const exportTime = now
      .toTimeString()
      .split(" ")[0]
      .replace(/:/g, "-");

    let fileName = "Daily Admissions Report";

    if (filters.dateAuthorised && filters.dischargeDate) {
      fileName += ` (${filters.dateAuthorised} to ${filters.dischargeDate})`;
    } else if (filters.dateAuthorised) {
      fileName += ` (Authorised ${filters.dateAuthorised})`;
    } else if (filters.dischargeDate) {
      fileName += ` (Discharged ${filters.dischargeDate})`;
    }

    fileName += ` - Exported ${exportDate} ${exportTime}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    toast.success(
      `${exportData.length} record${exportData.length === 1 ? "" : "s"} exported successfully.`
    );
  } catch (error) {
    console.error("Export failed:", error);
    toast.error("Failed to export report.");
  } finally {
    toast.dismiss(loadingToast);
    setExporting(false);
  }
};

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">
      Daily Admissions Report
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