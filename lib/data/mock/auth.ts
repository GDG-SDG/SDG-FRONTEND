// 인증 mock — api-spec.md `/auth` 기준
import type { LoginResponse, SignupResponse } from "@/lib/types/auth";

/** POST /auth/signup mock 응답 */
export const MOCK_SIGNUP_RESPONSE: SignupResponse = {
  userId: 1,
};

/** POST /auth/login mock 응답 — 어떤 자격증명이든 성공 처리 (refreshToken은 쿠키 몫) */
export const MOCK_LOGIN_RESPONSE: LoginResponse = {
  accessToken: "mock-access-token",
  tokenType: "Bearer",
};
