// 캘린더 API — api-spec.md 기준 (mock은 MSW 핸들러가 처리)
import { apiFetch, buildQuery } from "./client";
import type { CalendarDayCount, CalendarDiagnosis } from "@/lib/types/calendar";

/** GET /calendar/diagnoses — 월별 집계 (month는 1-based) */
export async function getCalendarMonth(
  year: number,
  month: number,
): Promise<CalendarDayCount[]> {
  return apiFetch<CalendarDayCount[]>(
    `/calendar/diagnoses${buildQuery({ year, month })}`,
  );
}

/** GET /calendar/diagnoses/{date} — 특정 날짜 기록 */
export async function getCalendarByDate(
  date: string,
): Promise<CalendarDiagnosis[]> {
  return apiFetch<CalendarDiagnosis[]>(`/calendar/diagnoses/${date}`);
}
