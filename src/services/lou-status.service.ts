import { LouReport } from "@/src/components/Datatable";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/care-management/lou-status-report`;

export interface LouStatusResponse {
  items: LouReport[];
  totalPages: number;
}

export async function getLouStatusReport(params: URLSearchParams) {
  const response = await fetch(`${API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to load LOU Status Report");
  }

  return response.json() as Promise<LouStatusResponse>;
}

export async function exportLouStatusReport(params: URLSearchParams) {
  const response = await fetch(`${API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to export report");
  }

  return response.json();
}