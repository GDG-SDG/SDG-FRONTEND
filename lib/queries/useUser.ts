// 사용자 조회 훅 — TanStack Query
import { useQuery } from "@tanstack/react-query";
import { getMypage, getMypageSummary } from "@/lib/api/user";
import { queryKeys } from "./keys";

/** 내 정보 */
export function useMypage() {
  return useQuery({
    queryKey: queryKeys.mypage,
    queryFn: getMypage,
  });
}

/** 마이페이지 통계 */
export function useMypageSummary() {
  return useQuery({
    queryKey: queryKeys.mypageSummary,
    queryFn: getMypageSummary,
  });
}
