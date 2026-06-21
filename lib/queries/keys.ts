// TanStack Query queryKey 팩토리 — 중복/오타 방지
import type { DiagnosisFilters } from "@/lib/types/diagnosis";

export const queryKeys = {
  diagnoses: (filters?: DiagnosisFilters) =>
    ["diagnoses", "list", filters ?? {}] as const,
  diagnosisDetail: (id: string | number) =>
    ["diagnoses", "detail", id] as const,
  similarCases: (id: string | number) => ["diagnoses", "similar", id] as const,
  crops: ["crops"] as const,
  mypage: ["users", "mypage"] as const,
  mypageSummary: ["users", "mypage", "summary"] as const,
  notificationSettings: ["users", "notification-settings"] as const,
  monthlyStats: (year: number) =>
    ["diagnoses", "stats", "monthly", year] as const,
  chatSessions: ["chat", "sessions"] as const,
  chatMessages: (sessionId: string) =>
    ["chat", "sessions", sessionId, "messages"] as const,
  calendarMonth: (year: number, month: number) =>
    ["calendar", year, month] as const,
  calendarByDate: (date: string) => ["calendar", "date", date] as const,
};
