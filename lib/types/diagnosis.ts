// 진단 / 기록 / 통계 타입 — api-spec.md 기준
import type { LesionArea, Severity, TreatmentStatus, Weather } from "./common";

/** POST /diagnoses 응답 (※ AI 연동 미구현) */
export interface DiagnoseResponse {
  id: number;
  cropName: string;
  diseaseName: string;
  confidence: number;
  severity: Severity;
  treatmentStatus: TreatmentStatus;
  diagnosedAt: string;
}

/** GET /diagnoses content[] (진단 기록 목록 아이템) */
export interface DiagnosisListItem {
  id: number;
  cropName: string;
  imageUrl: string;
  diseaseName: string;
  confidence: number;
  severity: Severity;
  treatmentStatus: TreatmentStatus;
  diagnosedAt: string;
  weather: Weather;
  description: string;
  lesionArea: LesionArea;
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
  lesionArea: LesionArea;
  rank: number;
  treatmentSteps: TreatmentStep[];
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
  weather: Weather;
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
