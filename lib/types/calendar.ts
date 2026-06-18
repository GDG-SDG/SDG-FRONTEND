// 캘린더 타입 — api-spec.md 기준
import type { Severity } from "./common";

/** GET /calendar/diagnoses — 월별 일자별 집계 */
export interface CalendarDayCount {
  date: string; // "2026-05-15"
  count: number;
  mildCount: number;
  moderateCount: number;
  severeCount: number;
  treatmentRequiredCount: number;
}

/** GET /calendar/diagnoses/{date} — 특정 날짜 기록 */
export interface CalendarDiagnosis {
  id: number;
  cropName: string;
  diseaseName: string;
  severity: Severity;
  imageUrl: string | null;
  confidence: number;
  location: string;
}
