// 사용자 API — api-spec.md 기준
import { apiFetch, USE_MOCK } from "./client";
import type { Mypage, MypageSummary } from "@/lib/types/user";
import { MOCK_MYPAGE, MOCK_MYPAGE_SUMMARY } from "@/lib/data/mock/user";

/** GET /users/mypage — 내 정보 */
export async function getMypage(): Promise<Mypage> {
  if (USE_MOCK) return MOCK_MYPAGE;
  return apiFetch<Mypage>("/users/mypage");
}

/** GET /users/mypage/summary — 마이페이지 통계 */
export async function getMypageSummary(): Promise<MypageSummary> {
  if (USE_MOCK) return MOCK_MYPAGE_SUMMARY;
  return apiFetch<MypageSummary>("/users/mypage/summary");
}
