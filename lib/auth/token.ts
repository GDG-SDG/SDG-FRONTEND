// 인증 토큰 저장소 — accessToken만 localStorage 보관.
// refreshToken은 백엔드가 HttpOnly 쿠키로 관리하므로 JS에서 접근/저장하지 않는다.

const ACCESS_TOKEN_KEY = "agriguard.accessToken";

const isBrowser = typeof window !== "undefined";

export function getAccessToken(): string | null {
  if (!isBrowser) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(accessToken: string): void {
  if (!isBrowser) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function clearTokens(): void {
  if (!isBrowser) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}
