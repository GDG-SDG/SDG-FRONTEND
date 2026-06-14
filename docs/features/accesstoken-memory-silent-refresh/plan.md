# accesstoken-memory-silent-refresh

| 항목         | 값                                                      |
| ------------ | ------------------------------------------------------- |
| GitHub Issue | #18 — https://github.com/GDG-SDG/SDG-FRONTEND/issues/18 |
| Branch       | fix/18-accesstoken-memory-silent-refresh                |
| 작성자       | a1rhun                                                  |
| 작성일       | 2026-06-14                                              |
| Type         | Fix                                                     |

## 🎯 작업 목적

accessToken을 localStorage에서 메모리로 옮겨 XSS 토큰 탈취 위험을 제거하고, 부팅 시 silent refresh로 새로고침 후에도 로그인 상태를 유지하며, 만료(403) 시 자동 재발급·자동 로그아웃이 정상 동작하도록 인증 흐름을 바로잡는다.

## 📋 작업 범위

**포함 (In Scope)**

- [ ] accessToken 저장소를 localStorage → 메모리(JS 변수)로 전환 (XSS 토큰 탈취 노출 제거)
- [ ] 앱 부팅 시 refreshToken(HttpOnly 쿠키) 기반 silent refresh로 로그인 상태 복구
- [ ] nav bar 고정 (스크롤 시에도 위치 고정)
- [ ] API 인터셉터의 refresh 트리거 조건을 401 → (401 || 403)으로 확장 (백엔드 Spring Security 403 계약 불일치 대응)
- [ ] refresh 실패(토큰 만료) 시 자동 로그아웃 처리 (토큰 정리 + 로그인 페이지 이동)

**제외 (Out of Scope)**

- (수동 작성)

## 🛠️ 접근 방식

- `lib/auth/token.ts`: localStorage 저장 → 모듈 스코프 변수 보관으로 교체. `getAccessToken` / `setAccessToken` / `clearTokens` 시그니처는 유지해 호출부 영향 최소화.
- `lib/api/client.ts`: `res.status === 401` 조건을 `(res.status === 401 || res.status === 403)`으로 확장해 403도 refresh 트리거에 포함. 기존 `!path.startsWith("/auth/")` 가드로 refresh 자체 실패 시 무한루프는 방지됨.
- 부팅 silent refresh: 앱 최상단(Provider/layout)에서 `refresh()` 1회 호출 후 새 accessToken을 메모리에 주입. 완료 전까지는 인증 상태 로딩 처리.
- 자동 로그아웃: refresh 실패 시 `clearTokens()` 후 로그인 페이지로 리다이렉트.

## 🔗 참고 자료

| 유형      | 링크                                        |
| --------- | ------------------------------------------- |
| Figma     | -                                           |
| Storybook | -                                           |
| API 명세  | -                                           |
| 기타      | 백엔드 401/403 구분 — api-spec.md 확인 필요 |

## 🤔 주요 결정 사항

- accessToken 메모리 보관 시 멀티 탭은 각 탭이 부팅마다 silent refresh 1회 수행(refreshToken 쿠키는 공유 → 정상 동작). 표준 패턴의 정상 트레이드오프로 수용.

<!-- /note 또는 수동으로 추가 -->
