// API 응답 형태(api-spec.md)에 맞춘 사용자 mock
import type {
  Mypage,
  MypageSummary,
  NotificationSettings,
} from "@/lib/types/user";

/** GET /users/mypage */
export const MOCK_MYPAGE: Mypage = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "김농부",
  email: "farmer.kim@example.com",
  phone: "010-1234-5678",
  location: "경기도 이천시",
  farmType: "노지 재배",
  joinedAt: "2025-03-15",
};

/** GET /users/mypage/summary */
export const MOCK_MYPAGE_SUMMARY: MypageSummary = {
  totalDiagnosisCount: 24,
  monthlyDiagnosisCount: 5,
  treatmentCompletedCount: 19,
};

/** GET /users/notification-settings (mock — 갱신 시 직접 수정) */
export const MOCK_NOTIFICATION_SETTINGS: NotificationSettings = {
  diagnosisResult: true,
  treatmentReminder: true,
  weatherAlert: false,
};
