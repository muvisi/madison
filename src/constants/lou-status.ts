
export const LOU_STATUS = {
  ADMITTED: "ADMITTED",
  DAY_CASE: "DAY CASE",
  DISCHARGED: "Discharged",
  SCHEDULED: "Scheduled",
} as const;

export interface LouStatus {
  value: string;
  label: string;
}

export const LOU_STATUSES: LouStatus[] = [
  {
    value: LOU_STATUS.ADMITTED,
    label: "ADMITTED",
  },
  {
    value: LOU_STATUS.DAY_CASE,
    label: "DAY CASE",
  },
  {
    value: LOU_STATUS.DISCHARGED,
    label: "Discharged",
  },
  {
    value: LOU_STATUS.SCHEDULED,
    label: "Scheduled",
  },
];