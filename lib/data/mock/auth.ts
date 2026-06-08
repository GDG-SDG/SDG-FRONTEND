// 인증 mock — api-spec.md `/auth` 기준
import type { LoginResponse, SignupResponse } from "@/lib/types/auth";
import { MOCK_MYPAGE } from "./user";

/** POST /auth/signup mock 응답 */
export const MOCK_SIGNUP_RESPONSE: SignupResponse = {
  userId: MOCK_MYPAGE.id,
};

/** POST /auth/login mock 응답 — 어떤 자격증명이든 성공 처리 */
export const MOCK_LOGIN_RESPONSE: LoginResponse = {
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  user: MOCK_MYPAGE,
};
