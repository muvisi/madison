import { FollowUpReport } from "@/src/components/Datatable";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/care-management/follow-up-report`;

export interface FollowUpStatusResponse {
  items: FollowUpReport[];
  totalPages: number;
}

export async function getFollowUpStatusReport(params: URLSearchParams) {
  const response = await fetch(`${API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to load Follow-up Status Report");
  }

  return response.json() as Promise<FollowUpStatusResponse>;
}

export async function exportFollowUpStatusReport(params: URLSearchParams) {
  const response = await fetch(`${API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to export report");
  }

  return response.json();
}