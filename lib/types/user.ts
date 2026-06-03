// 사용자 / 마이페이지 타입 — api-spec.md 기준

/** GET /users/mypage/summary (대시보드 통계) */
export interface MypageSummary {
  totalDiagnosisCount: number;
  monthlyDiagnosisCount: number;
  treatmentCompletedCount: number;
}
