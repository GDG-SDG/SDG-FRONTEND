// 인증 타입 — api-spec.md `/auth` 기준

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

/**
 * POST /auth/login 응답
 * refreshToken은 HttpOnly 쿠키로 내려오므로 body에는 accessToken만 포함된다.
 * (배포 백엔드 실제 응답: { accessToken, tokenType } — user는 포함되지 않아 /users/mypage로 별도 조회)
 */
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

/**
 * POST /auth/refresh 응답
 * 요청 body는 없고 refreshToken은 쿠키에서 읽는다. 새 accessToken만 body로 반환.
 */
export interface RefreshResponse {
  accessToken: string;
}
