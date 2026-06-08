// 인증 토큰 저장소 — localStorage 기반 (백엔드 연동 전 최소 구현)
// 추후 refresh 토큰 회전·secure cookie 등으로 고도화 예정

const ACCESS_TOKEN_KEY = "agriguard.accessToken";
const REFRESH_TOKEN_KEY = "agriguard.refreshToken";

const isBrowser = typeof window !== "undefined";

export function getAccessToken(): string | null {
  if (!isBrowser) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  if (!isBrowser) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearTokens(): void {
  if (!isBrowser) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}
