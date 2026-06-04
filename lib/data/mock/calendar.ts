// API 응답 형태(api-spec.md)에 맞춘 캘린더 mock — 진단 목록 mock에서 파생
import type { CalendarDayCount, CalendarDiagnosis } from "@/lib/types/calendar";
import { MOCK_DIAGNOSIS_LIST } from "./diagnoses";

const LOCATION = "경기도 이천시 마장면";
const dateOf = (iso: string) => iso.slice(0, 10);

/** GET /calendar/diagnoses — month는 1-based */
export function getMockCalendarMonth(
  year: number,
  month: number,
): CalendarDayCount[] {
  const map = new Map<string, CalendarDayCount>();
  for (const item of MOCK_DIAGNOSIS_LIST) {
    const d = new Date(item.diagnosedAt);
    if (d.getFullYear() !== year || d.getMonth() + 1 !== month) continue;
    const date = dateOf(item.diagnosedAt);
    const entry = map.get(date) ?? {
      date,
      count: 0,
      mildCount: 0,
      moderateCount: 0,
      severeCount: 0,
      treatmentRequiredCount: 0,
    };
    entry.count++;
    if (item.severity === "심각") entry.severeCount++;
    else if (item.severity === "보통") entry.moderateCount++;
    else entry.mildCount++;
    if (item.treatmentStatus === "방제 필요") entry.treatmentRequiredCount++;
    map.set(date, entry);
  }
  return Array.from(map.values());
}

/** GET /calendar/diagnoses/{date} */
export function getMockCalendarByDate(date: string): CalendarDiagnosis[] {
  return MOCK_DIAGNOSIS_LIST.filter(
    (item) => dateOf(item.diagnosedAt) === date,
  ).map((item) => ({
    id: item.id,
    cropName: item.cropName,
    diseaseName: item.diseaseName,
    severity: item.severity,
    imageUrl: item.imageUrl,
    confidence: item.confidence,
    location: LOCATION,
  }));
}
