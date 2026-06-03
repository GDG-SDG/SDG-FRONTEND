// 캘린더 API — api-spec.md 기준
import { apiFetch, buildQuery, USE_MOCK } from "./client";
import type { CalendarDayCount, CalendarDiagnosis } from "@/lib/types/calendar";
import {
  getMockCalendarByDate,
  getMockCalendarMonth,
} from "@/lib/data/mock/calendar";

/** GET /calendar/diagnoses — 월별 집계 (month는 1-based) */
export async function getCalendarMonth(
  year: number,
  month: number,
): Promise<CalendarDayCount[]> {
  if (USE_MOCK) return getMockCalendarMonth(year, month);
  return apiFetch<CalendarDayCount[]>(
    `/calendar/diagnoses${buildQuery({ year, month })}`,
  );
}

/** GET /calendar/diagnoses/{date} — 특정 날짜 기록 */
export async function getCalendarByDate(
  date: string,
): Promise<CalendarDiagnosis[]> {
  if (USE_MOCK) return getMockCalendarByDate(date);
  return apiFetch<CalendarDiagnosis[]>(`/calendar/diagnoses/${date}`);
}
