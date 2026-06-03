// 진단 / 기록 API — api-spec.md 기준
import { apiFetch, buildQuery, USE_MOCK } from "./client";
import type { Page } from "@/lib/types/common";
import type { TreatmentStatus } from "@/lib/types/common";
import type {
  DiagnosisDetail,
  DiagnosisFilters,
  DiagnosisListItem,
  MonthlyStat,
  SimilarCase,
  TreatmentStatusUpdate,
} from "@/lib/types/diagnosis";
import {
  MOCK_DIAGNOSIS_DETAILS,
  MOCK_DIAGNOSIS_LIST,
  MOCK_MONTHLY_STATS,
  MOCK_SIMILAR_CASES,
} from "@/lib/data/mock/diagnoses";

/** GET /diagnoses — 진단 기록 목록 (필터 + 페이징) */
export async function getDiagnoses(
  filters: DiagnosisFilters = {},
): Promise<Page<DiagnosisListItem>> {
  if (USE_MOCK) {
    const content = MOCK_DIAGNOSIS_LIST.filter((item) => {
      const sevOk = !filters.severity || item.severity === filters.severity;
      const statusOk =
        !filters.treatmentStatus ||
        item.treatmentStatus === filters.treatmentStatus;
      return sevOk && statusOk;
    });
    return {
      content,
      page: filters.page ?? 0,
      size: content.length,
      totalElements: content.length,
    };
  }

  const query = buildQuery({ ...filters });
  return apiFetch<Page<DiagnosisListItem>>(`/diagnoses${query}`);
}

/** GET /diagnoses/{id} — 진단 상세 조회 */
export async function getDiagnosisDetail(id: number): Promise<DiagnosisDetail> {
  if (USE_MOCK) {
    const detail = MOCK_DIAGNOSIS_DETAILS[id];
    if (!detail) throw new Error(`mock 진단 상세 없음: ${id}`);
    return detail;
  }

  return apiFetch<DiagnosisDetail>(`/diagnoses/${id}`);
}

/** GET /diagnoses/{id}/similar-cases — 유사 사례 조회 */
export async function getSimilarCases(id: number): Promise<SimilarCase[]> {
  if (USE_MOCK) return MOCK_SIMILAR_CASES;
  return apiFetch<SimilarCase[]>(`/diagnoses/${id}/similar-cases`);
}

/** PATCH /diagnoses/{id}/treatment-status — 방제 상태 변경 */
export async function updateTreatmentStatus(
  id: number,
  treatmentStatus: TreatmentStatus,
): Promise<TreatmentStatusUpdate> {
  if (USE_MOCK) {
    const detail = MOCK_DIAGNOSIS_DETAILS[id];
    if (detail) detail.treatmentStatus = treatmentStatus;
    const item = MOCK_DIAGNOSIS_LIST.find((d) => d.id === id);
    if (item) item.treatmentStatus = treatmentStatus;
    return { id, treatmentStatus, updated: true };
  }
  return apiFetch<TreatmentStatusUpdate>(`/diagnoses/${id}/treatment-status`, {
    method: "PATCH",
    body: { treatmentStatus },
  });
}

/** GET /diagnoses/stats/monthly — 연간 월별 통계 */
export async function getMonthlyStats(year: number): Promise<MonthlyStat[]> {
  if (USE_MOCK) return MOCK_MONTHLY_STATS;
  return apiFetch<MonthlyStat[]>(
    `/diagnoses/stats/monthly${buildQuery({ year })}`,
  );
}
