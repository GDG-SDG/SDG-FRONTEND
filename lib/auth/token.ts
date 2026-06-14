// 인증 토큰 저장소 — accessToken은 메모리(모듈 스코프 변수)에만 보관한다.
// localStorage에 두면 XSS 발생 시 토큰이 그대로 탈취되므로, 표준 패턴대로
// 메모리에만 두고 새로고침 시 사라지는 건 부팅 silent refresh로 복구한다.
// refreshToken은 백엔드가 HttpOnly 쿠키로 관리하므로 JS에서 접근/저장하지 않는다.

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function clearTokens(): void {
  accessToken = null;
}
