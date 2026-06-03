// 진단 기록 조회 훅 — TanStack Query
import { useQuery } from "@tanstack/react-query";
import { getDiagnoses, getDiagnosisDetail } from "@/lib/api/diagnose";
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
