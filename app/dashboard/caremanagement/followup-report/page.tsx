"use client";

import { useEffect, useState } from "react";
import Datatable, { Column, FollowUpReport } from "@/src/components/Datatable";
import ReportFilters, { FilterField } from "@/src/components/ReportFilters";
import { LOU_STATUS, LOU_STATUSES } from "@/src/constants/lou-status";
import {
  getFollowUpStatusReport,
  exportFollowUpStatusReport,
} from "@/src/services/followup.service";
import TooltipText from "@/src/components/Tooltip";

const filterFields: FilterField[] = [
  {
    key: "memberNumber",
    placeholder: "Member Number",
    type: "text",
  },
  {
    key: "corporate",
    placeholder: "Corporate",
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
    key: "followUpDate",
    placeholder: "Follow-up Date",
    type: "date",
  },
  {
    key: "dateAdmitted",
    placeholder: "Date Admitted",
    type: "date",
  },
  {
    key: "dischargeDate",
    placeholder: "Date Discharged",
    type: "date",
  },
];


const columns: Column<FollowUpReport>[] = [

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
    key: "corporate",
    label: "Corporate",
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
    key: "dateAdmitted",
    label: "Date Admitted",
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
  render: (value) => (
    <TooltipText text={String(value ?? "")} />
  ),
},
  {
    key: "amountAuthorised",
    label: "Amount Authorized",
    render: (value) =>
      new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(Number(value)),
    },
 {
  key: "currentActiveManagement",
  label: "Current Active Management",
  render: (value) => (
    <TooltipText text={String(value ?? "")} />
  ),
},

 {
  key: "notes",
  label: "Care Notes",
  render: (value) => (
    <TooltipText text={String(value ?? "")} />
  ),
},
    {
     key: "exclusionOrNonPayables",
     label: "Exclusion/Non-Payables",
    },
    
    {
        key: "interimBill",
        label: "Interim Bill",
          render: (value) =>
      new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(Number(value)),

    },
    
    {
     key: "followUpDate",
     label: "Follow-up Date",
    },
    {
     key: "followUpType",
     label: "Follow-up Type",
    },

 
 
];

export default function FollowUpStatusReport() {
  const [followUpReports, setFollowUpReports] = useState<FollowUpReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    memberNumber: "",
    corporate: "",
    providerName: "",
    admissionStatus: "",
    followUpDate: "",
    dateAdmitted: "",
    dateAuthorised: "",
    dischargeDate: "",
  
  });


 const loadFollowUpStatusReport = async (
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

 
    const data = await getFollowUpStatusReport(params);

    setFollowUpReports(data.items);
    setTotalPages(data.totalPages);

  } catch (error) {
    console.error(error);
    setFollowUpReports([]);
    setTotalPages(1);
  } finally {
    setLoading(false);
    setSearching(false);
    setExporting(false);
  }
};

  useEffect(() => {
    loadFollowUpStatusReport(page);
  }, [page]);

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    setPage(1);
    loadFollowUpStatusReport(1);
  };

  const handleReset = () => {
    const resetFilters = {
    memberNumber: "",
    corporate: "",
    providerName: "",
    admissionStatus: "",
    followUpDate: "",
    dateAdmitted: "",
    dateAuthorised: "",
    dischargeDate: "",

    };

    setFilters(resetFilters);
    setPage(1);
    loadFollowUpStatusReport(1, resetFilters);
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



    const result = await exportFollowUpStatusReport(params);

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

    let fileName = "Follow-up Report";

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
      Follow-up Report
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
          data={followUpReports}
          loading={loading}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}