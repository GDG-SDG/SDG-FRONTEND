// 인증 API — api-spec.md `/auth` 기준 (mock은 MSW 핸들러가 처리)
import { apiFetch } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  SignupRequest,
  SignupResponse,
} from "@/lib/types/auth";

/** POST /auth/signup — 회원가입 */
export async function signup(body: SignupRequest): Promise<SignupResponse> {
  return apiFetch<SignupResponse>("/auth/signup", {
    method: "POST",
    body,
  });
}

/** POST /auth/login — 로그인 */
export async function login(body: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body,
  });
}

/** POST /auth/logout — 로그아웃 (204 No Content) */
export async function logout(): Promise<void> {
  await apiFetch<void>("/auth/logout", {
    method: "POST",
  });
}

/** POST /auth/refresh — 토큰 재발급 (refreshToken은 쿠키에서 읽음, body 없음) */
export async function refresh(): Promise<RefreshResponse> {
  return apiFetch<RefreshResponse>("/auth/refresh", {
    method: "POST",
  });
}
