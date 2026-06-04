// 작물 목록 조회 훅 — TanStack Query
import { useQuery } from "@tanstack/react-query";
import { getCrops } from "@/lib/api/crop";
import { queryKeys } from "./keys";

/** 작물 목록 — 자주 안 바뀌므로 staleTime 길게 */
export function useCrops() {
  return useQuery({
    queryKey: queryKeys.crops,
    queryFn: getCrops,
    staleTime: 1000 * 60 * 30,
  });
}
