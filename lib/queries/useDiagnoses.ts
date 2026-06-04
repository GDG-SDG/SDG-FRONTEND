// 진단 기록 조회 훅 — TanStack Query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDiagnoses,
  getDiagnosisDetail,
  getMonthlyStats,
  getSimilarCases,
  updateTreatmentStatus,
} from "@/lib/api/diagnose";
import type { TreatmentStatus } from "@/lib/types/common";
import type { DiagnosisFilters } from "@/lib/types/diagnosis";
import { queryKeys } from "./keys";

/** 진단 기록 목록 */
export function useDiagnoses(filters: DiagnosisFilters = {}) {
  return useQuery({
    queryKey: queryKeys.diagnoses(filters),
    queryFn: () => getDiagnoses(filters),
  });
}

/** 진단 상세 — id가 null이면 비활성 */
export function useDiagnosisDetail(id: number | null) {
  return useQuery({
    queryKey: queryKeys.diagnosisDetail(id ?? -1),
    queryFn: () => getDiagnosisDetail(id as number),
    enabled: id !== null,
  });
}

/** 유사 사례 — id가 null이면 비활성 */
export function useSimilarCases(id: number | null) {
  return useQuery({
    queryKey: queryKeys.similarCases(id ?? -1),
    queryFn: () => getSimilarCases(id as number),
    enabled: id !== null,
  });
}

/** 연간 월별 통계 */
export function useMonthlyStats(year: number) {
  return useQuery({
    queryKey: queryKeys.monthlyStats(year),
    queryFn: () => getMonthlyStats(year),
  });
}

/** 방제 상태 변경 — 성공 시 목록·상세 갱신 */
export function useUpdateTreatmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: number; treatmentStatus: TreatmentStatus }) =>
      updateTreatmentStatus(params.id, params.treatmentStatus),
    onSuccess: (_data, variables) => {
      // 목록과 해당 상세만 갱신 (통계·유사사례는 영향 없으므로 제외)
      queryClient.invalidateQueries({ queryKey: ["diagnoses", "list"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.diagnosisDetail(variables.id),
      });
    },
  });
}
