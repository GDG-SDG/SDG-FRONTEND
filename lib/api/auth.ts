// 인증 API — api-spec.md `/auth` 기준 (mock은 MSW 핸들러가 처리)
import { apiFetch } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshRequest,
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

/** POST /auth/logout — 로그아웃 */
export async function logout(): Promise<LogoutResponse> {
  return apiFetch<LogoutResponse>("/auth/logout", {
    method: "POST",
  });
}

/** POST /auth/refresh — 토큰 재발급 */
export async function refresh(body: RefreshRequest): Promise<RefreshResponse> {
  return apiFetch<RefreshResponse>("/auth/refresh", {
    method: "POST",
    body,
  });
}
