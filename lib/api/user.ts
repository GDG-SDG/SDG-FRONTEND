// 사용자 API — api-spec.md 기준 (mock은 MSW 핸들러가 처리)
import { apiFetch } from "./client";
import type {
  Mypage,
  MypageSummary,
  NotificationSettings,
  UpdateMypageRequest,
  UpdatePasswordRequest,
} from "@/lib/types/user";

/** GET /users/mypage — 내 정보 */
export async function getMypage(): Promise<Mypage> {
  return apiFetch<Mypage>("/users/mypage");
}

/** GET /users/mypage/summary — 마이페이지 통계 */
export async function getMypageSummary(): Promise<MypageSummary> {
  return apiFetch<MypageSummary>("/users/mypage/summary");
}

/** GET /users/notification-settings — 알림 설정 조회 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  return apiFetch<NotificationSettings>("/users/notification-settings");
}

/** PATCH /users/notification-settings — 알림 설정 수정 */
export async function updateNotificationSettings(
  settings: NotificationSettings,
): Promise<{ updated: boolean }> {
  return apiFetch<{ updated: boolean }>("/users/notification-settings", {
    method: "PATCH",
    body: settings,
  });
}

/** PATCH /users/mypage — 내 정보 수정 */
export async function updateMypage(
  body: UpdateMypageRequest,
): Promise<{ id: number; updated: boolean }> {
  return apiFetch<{ id: number; updated: boolean }>("/users/mypage", {
    method: "PATCH",
    body,
  });
}

/** PATCH /users/password — 비밀번호 변경 */
export async function updatePassword(
  body: UpdatePasswordRequest,
): Promise<{ updated: boolean }> {
  return apiFetch<{ updated: boolean }>("/users/password", {
    method: "PATCH",
    body,
  });
}

/** DELETE /users — 회원 탈퇴 */
export async function deleteUser(
  password: string,
): Promise<{ deleted: boolean }> {
  return apiFetch<{ deleted: boolean }>("/users", {
    method: "DELETE",
    body: { password },
  });
}
