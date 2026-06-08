// 인증 타입 — api-spec.md `/auth` 기준
import type { Mypage } from "./user";

/** POST /auth/signup 요청 */
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  farmType: string;
}

/** POST /auth/signup 응답 */
export interface SignupResponse {
  userId: number;
}

/** POST /auth/login 요청 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** POST /auth/login 응답 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: Mypage;
}

/** POST /auth/logout 응답 */
export interface LogoutResponse {
  loggedOut: boolean;
}

/** POST /auth/refresh 요청 */
export interface RefreshRequest {
  refreshToken: string;
}

/** POST /auth/refresh 응답 */
export interface RefreshResponse {
  accessToken: string;
}
