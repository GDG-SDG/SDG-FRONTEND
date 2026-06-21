// 진단 / 기록 / 통계 타입 — api-spec.md 기준
import type { LesionArea, Severity, TreatmentStatus, Weather } from "./common";

/** POST /diagnoses 요청 (multipart/form-data) */
export interface CreateDiagnosisRequest {
  cropId: number;
  location: string;
  image: File;
}

/** POST /diagnoses results[] 항목 — 실제 응답 기준 (id는 UUID 문자열) */
export interface DiagnoseResultItem {
  id: string;
  diseaseName: string;
  diseaseNameKr: string;
  confidence: number;
  severity: Severity;
  // 백엔드가 빈 문자열/null을 줄 수 있다.
  description: string | null;
  lesionArea: LesionArea | null;
  rank: number;
  // YOLO 결과는 방제 단계가 비어 있을 수 있다.
  treatmentSteps: TreatmentStep[];
  source: string;
}

/**
 * POST /diagnoses 응답.
 * ※ 실제 백엔드는 api-spec의 요약 형태가 아니라 상세 전체(results[])를 반환하며
 *    id는 UUID 문자열이다. (2026-06-19 실응답 기준으로 정정)
 */
export interface DiagnoseResponse {
  id: string;
  cropName: string;
  imageUrl: string;
  location: string;
  severity: Severity;
  treatmentStatus: TreatmentStatus;
  diagnosedAt: string | null;
  weather: {
    temperature: number | null;
    humidity: number | null;
    precipitation: number | null;
  };
  results: DiagnoseResultItem[];
}

/** GET /diagnoses content[] (진단 기록 목록 아이템) */
export interface DiagnosisListItem {
  id: number;
  cropName: string;
  // 백엔드가 이미지 미보유 시 null/빈값을 줄 수 있어 렌더 시 가드한다.
  imageUrl: string | null;
  diseaseName: string;
  confidence: number;
  severity: Severity;
  treatmentStatus: TreatmentStatus;
  diagnosedAt: string;
  weather: Weather;
  description: string;
  // AI 연동 미구현 구간에서는 백엔드가 병변 좌표를 null로 내려줄 수 있다.
  lesionArea: LesionArea | null;
}

/** 방제 단계 (상세 results[].treatmentSteps[]) */
export interface TreatmentStep {
  stepOrder: number;
  title: string;
  description: string;
  chemical: string | null;
}

/** 상세 진단 결과 (GET /diagnoses/{id} results[]) */
export interface DiagnosisResult {
  id: number;
  diseaseName: string;
  diseaseNameKr: string;
  confidence: number;
  severity: Severity;
  description: string;
  lesionArea: LesionArea | null;
  rank: number;
  // AI 연동 미구현 구간에서는 방제 단계가 비어 있거나 null일 수 있다.
  treatmentSteps: TreatmentStep[] | null;
  source: string;
}

/** GET /diagnoses/{id} (진단 상세) */
export interface DiagnosisDetail {
  id: number;
  cropName: string;
  imageUrl: string;
  location: string;
  severity: Severity;
  treatmentStatus: TreatmentStatus;
  diagnosedAt: string;
  weather: Weather;
  results: DiagnosisResult[];
}

/** GET /diagnoses/{id}/similar-cases */
export interface SimilarCase {
  id: number;
  location: string;
  cropName: string;
  severity: Severity;
  weather: Weather | null;
  diagnosedAt: string;
}

/** PATCH /diagnoses/{id}/treatment-status 응답 */
export interface TreatmentStatusUpdate {
  id: number;
  treatmentStatus: TreatmentStatus;
  updated: boolean;
}

/** GET /diagnoses 쿼리 파라미터 */
export interface DiagnosisFilters {
  cropId?: number;
  severity?: Severity;
  treatmentStatus?: TreatmentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

/** GET /diagnoses/stats/monthly */
export interface MonthlyStat {
  id: number;
  month: number;
  totalCount: number;
  severeCount: number;
  treatmentCompletedCount: number;
}
