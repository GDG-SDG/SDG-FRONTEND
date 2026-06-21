// 진단 / 기록 API — api-spec.md 기준 (mock은 MSW 핸들러가 처리)
import { apiFetch, buildQuery } from "./client";
import type { Page, TreatmentStatus } from "@/lib/types/common";
import type {
  CreateDiagnosisRequest,
  DiagnoseResponse,
  DiagnosisDetail,
  DiagnosisFilters,
  DiagnosisListItem,
  MonthlyStat,
  SimilarCase,
  TreatmentStatusUpdate,
} from "@/lib/types/diagnosis";

/** POST /diagnoses — 이미지 진단 요청 (multipart/form-data) */
export async function createDiagnosis({
  cropId,
  location,
  image,
}: CreateDiagnosisRequest): Promise<DiagnoseResponse> {
  const form = new FormData();
  form.append("cropId", String(cropId));
  form.append("location", location);
  form.append("image", image);
  return apiFetch<DiagnoseResponse>("/diagnoses", {
    method: "POST",
    body: form,
  });
}

/** GET /diagnoses — 진단 기록 목록 (필터 + 페이징) */
export async function getDiagnoses(
  filters: DiagnosisFilters = {},
): Promise<Page<DiagnosisListItem>> {
  return apiFetch<Page<DiagnosisListItem>>(
    `/diagnoses${buildQuery({ ...filters })}`,
  );
}

/** GET /diagnoses/{id} — 진단 상세 조회 */
export async function getDiagnosisDetail(
  id: string | number,
): Promise<DiagnosisDetail> {
  return apiFetch<DiagnosisDetail>(`/diagnoses/${id}`);
}

/** GET /diagnoses/{id}/similar-cases — 유사 사례 조회 (id는 number 또는 UUID 문자열) */
export async function getSimilarCases(
  id: string | number,
): Promise<SimilarCase[]> {
  return apiFetch<SimilarCase[]>(`/diagnoses/${id}/similar-cases`);
}

/** PATCH /diagnoses/{id}/treatment-status — 방제 상태 변경 */
export async function updateTreatmentStatus(
  id: number,
  treatmentStatus: TreatmentStatus,
): Promise<TreatmentStatusUpdate> {
  return apiFetch<TreatmentStatusUpdate>(`/diagnoses/${id}/treatment-status`, {
    method: "PATCH",
    body: { treatmentStatus },
  });
}

/** GET /diagnoses/stats/monthly — 연간 월별 통계 */
export async function getMonthlyStats(year: number): Promise<MonthlyStat[]> {
  return apiFetch<MonthlyStat[]>(
    `/diagnoses/stats/monthly${buildQuery({ year })}`,
  );
}
