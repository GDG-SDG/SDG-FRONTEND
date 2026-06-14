# auth-backend-integration

| 항목         | 값                                                      |
| ------------ | ------------------------------------------------------- |
| GitHub Issue | #13 — https://github.com/GDG-SDG/SDG-FRONTEND/issues/13 |
| Branch       | fix/13-auth-backend-integration                         |
| 작성자       | a1rhun                                                  |
| 작성일       | 2026-06-09                                              |
| Type         | Fix                                                     |

## 🎯 작업 목적

api-spec에서 확정된 인증 토큰 계약(refreshToken은 HttpOnly 쿠키, accessToken만 Body)에 프론트 구현을 맞추고, 받은 백엔드 배포 주소로 전체 실연동을 켜기 위해.

## 📋 작업 범위

**포함 (In Scope)**

- [ ] api-spec 인증 토큰 계약 반영 — refreshToken HttpOnly 쿠키 / accessToken만 Body
- [ ] `LoginResponse`에서 `refreshToken` 제거, `RefreshRequest`·`LogoutResponse` 타입 정리
- [ ] `apiFetch`에 `credentials: "include"` 추가 (쿠키 송수신)
- [ ] `logout` 204 No Content, `refresh` 쿠키 기반(body 없음)으로 시그니처 수정
- [ ] 토큰 저장소(`lib/auth/token.ts`)를 accessToken 단일 관리로 정리
- [ ] mock(`MOCK_LOGIN_RESPONSE`)·MSW handler(logout 204) 타입 정합성 맞춤
- [ ] 백엔드 배포 주소 반영 + 전체 실연동 (`NEXT_PUBLIC_USE_MOCK=false`)
- [ ] api-spec.md 상세 섹션을 요약 테이블 계약과 일치하도록 갱신
- [ ] type-check 통과 확인

**제외 (Out of Scope)**

- AI 진단(`POST /diagnoses`)·기상(`GET /weather`) 실연동 — 백엔드 미구현
- 401 응답 시 자동 토큰 재발급 인터셉터 — 후속 이슈로 분리

## 🛠️ 접근 방식

기존 fetch 기반 `apiFetch` 클라이언트와 `token` 모듈을 재사용하고 라이브러리는 추가하지 않습니다. refreshToken은 브라우저 JS가 접근하지 못하는 HttpOnly 쿠키로 관리되므로, 클라이언트에서는 accessToken만 localStorage에 보관하고 쿠키 송수신을 위해 fetch에 `credentials: "include"`만 추가합니다. 크로스 오리진(Cloud Run) 쿠키 전송은 백엔드 CORS(`Access-Control-Allow-Credentials`, `SameSite=None`) 설정에 의존합니다.

## 🔗 참고 자료

| 유형      | 링크                                                                    |
| --------- | ----------------------------------------------------------------------- |
| Figma     | -                                                                       |
| Storybook | -                                                                       |
| API 명세  | api-spec.md (`## 인증` 섹션)                                            |
| 기타      | 배포 base URL: https://sdg-backend-307053111333.asia-northeast3.run.app |

## 🤔 주요 결정 사항

- [2026-06-09] refreshToken은 클라이언트 저장 금지 — HttpOnly 쿠키만 신뢰원(source of truth). localStorage에는 accessToken만 저장.
- [2026-06-09] USE_MOCK=false 전체 실연동. 미구현 도메인(진단/기상)은 백엔드가 응답을 처리.
