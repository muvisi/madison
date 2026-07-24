"use client";

import DatePicker from "react-datepicker";
import { FiDownload, FiRefreshCw, FiSearch } from "react-icons/fi";
import { format } from "date-fns";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  placeholder?: string;
  type: "text" | "select" | "date";
  options?: SelectOption[];
  disabled?: boolean;
}

interface ReportFiltersProps {
  fields: FilterField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onExport: () => void;
  searching: boolean;
  exporting: boolean;
}

export default function ReportFilters({
  fields,
  values,
  onChange,
  onSearch,
  onReset,
  onExport,
  searching,
  exporting
}: ReportFiltersProps) {
  return (
    <div className="mb-5 rounded-lg border bg-white p-4 shadow-sm">
      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {fields.map((field) => (
          <div key={field.key}>
            {field.type === "text" && (
              <input
                type="text"
                value={values[field.key] ?? ""}
                placeholder={field.placeholder}
                disabled={field.disabled}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            )}

            {field.type === "select" && (
              <select
                value={values[field.key] ?? ""}
                disabled={field.disabled}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="" disabled hidden>
                  {field.placeholder}
                </option>

                {field.options?.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "date" && (
              <DatePicker
                selected={
                  values[field.key]
                    ? new Date(values[field.key])
                    : null
                }
                onChange={(date: Date | null) =>
                  onChange(field.key, date ? format(date, "yyyy-MM-dd") : "")
                }
                placeholderText={field.placeholder}
                dateFormat="yyyy-MM-dd"
                isClearable
                className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>

      {/* Buttons */}
  
      <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FiRefreshCw className="h-4 w-4" />
            Reset Filters
          </button>

          <button
            onClick={onSearch}
            disabled={searching || exporting}
            className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiSearch className="h-4 w-4" />
            {searching ? "Searching..." : "Search"}
          </button>

          <button
            onClick={onExport}
            disabled={searching || exporting}
            className="flex items-center gap-2 rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiDownload className="h-4 w-4" />
            {exporting ? "Exporting..." : "Export Excel"}
          </button>
      </div>
    </div>
  );
}