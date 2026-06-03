// TanStack Query queryKey 팩토리 — 중복/오타 방지
import type { DiagnosisFilters } from "@/lib/types/diagnosis";

export const queryKeys = {
  diagnoses: (filters?: DiagnosisFilters) =>
    ["diagnoses", "list", filters ?? {}] as const,
  diagnosisDetail: (id: number) => ["diagnoses", "detail", id] as const,
  mypageSummary: ["users", "mypage", "summary"] as const,
  monthlyStats: (year: number) =>
    ["diagnoses", "stats", "monthly", year] as const,
};
