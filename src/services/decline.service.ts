import { DeclineReport } from "@/src/components/Datatable";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/care-management/decline-report`;

export interface DeclineReportResponse {
  items: DeclineReport[];
  totalPages: number;
}

export async function getDeclineReport(params: URLSearchParams) {
  const response = await fetch(`${API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to load Decline Report");
  }

  return response.json() as Promise<DeclineReportResponse>;
}

export async function exportDeclineReport(params: URLSearchParams) {
  const response = await fetch(`${API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to export report");
  }

  return response.json();
}