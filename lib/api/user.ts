// 사용자 API — api-spec.md 기준
import { apiFetch, USE_MOCK } from "./client";
import type {
  Mypage,
  MypageSummary,
  NotificationSettings,
  UpdateMypageRequest,
  UpdatePasswordRequest,
} from "@/lib/types/user";
import {
  MOCK_MYPAGE,
  MOCK_MYPAGE_SUMMARY,
  MOCK_NOTIFICATION_SETTINGS,
} from "@/lib/data/mock/user";

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

/** GET /users/notification-settings — 알림 설정 조회 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  if (USE_MOCK) return MOCK_NOTIFICATION_SETTINGS;
  return apiFetch<NotificationSettings>("/users/notification-settings");
}

/** PATCH /users/notification-settings — 알림 설정 수정 */
export async function updateNotificationSettings(
  settings: NotificationSettings,
): Promise<{ updated: boolean }> {
  if (USE_MOCK) {
    Object.assign(MOCK_NOTIFICATION_SETTINGS, settings);
    return { updated: true };
  }
  return apiFetch<{ updated: boolean }>("/users/notification-settings", {
    method: "PATCH",
    body: settings,
  });
}

/** PATCH /users/mypage — 내 정보 수정 */
export async function updateMypage(
  body: UpdateMypageRequest,
): Promise<{ id: number; updated: boolean }> {
  if (USE_MOCK) {
    Object.assign(MOCK_MYPAGE, body);
    return { id: MOCK_MYPAGE.id, updated: true };
  }
  return apiFetch<{ id: number; updated: boolean }>("/users/mypage", {
    method: "PATCH",
    body,
  });
}

/** PATCH /users/password — 비밀번호 변경 */
export async function updatePassword(
  body: UpdatePasswordRequest,
): Promise<{ updated: boolean }> {
  if (USE_MOCK) return { updated: true };
  return apiFetch<{ updated: boolean }>("/users/password", {
    method: "PATCH",
    body,
  });
}

/** DELETE /users — 회원 탈퇴 */
export async function deleteUser(
  password: string,
): Promise<{ deleted: boolean }> {
  if (USE_MOCK) return { deleted: true };
  return apiFetch<{ deleted: boolean }>("/users", {
    method: "DELETE",
    body: { password },
  });
}
