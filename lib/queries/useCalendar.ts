// 캘린더 조회 훅 — TanStack Query
import { useQuery } from "@tanstack/react-query";
import { getCalendarByDate, getCalendarMonth } from "@/lib/api/calendar";
import { queryKeys } from "./keys";

/** 월별 집계 (month는 1-based) */
export function useCalendarMonth(year: number, month: number) {
  return useQuery({
    queryKey: queryKeys.calendarMonth(year, month),
    queryFn: () => getCalendarMonth(year, month),
  });
}

/** 특정 날짜 기록 — date가 null이면 비활성 */
export function useCalendarByDate(date: string | null) {
  return useQuery({
    queryKey: queryKeys.calendarByDate(date ?? ""),
    queryFn: () => getCalendarByDate(date as string),
    enabled: !!date,
  });
}
