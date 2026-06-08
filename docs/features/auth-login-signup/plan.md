# auth-login-signup

| 항목         | 값                                                      |
| ------------ | ------------------------------------------------------- |
| GitHub Issue | #11 — https://github.com/GDG-SDG/SDG-FRONTEND/issues/11 |
| Branch       | feature/11-auth-login-signup                            |
| 작성자       | a1rhun                                                  |
| 작성일       | 2026-06-08                                              |
| Type         | Feat                                                    |

## 🎯 작업 목적

auth 연동을 위한 로그인/회원가입 페이지 구현

## 📋 작업 범위

**포함 (In Scope)**

- [ ] 로그인 페이지 UI 구현
- [ ] 회원가입 페이지 UI 구현
- [ ] 폼 유효성 검사
- [ ] api-spec `/auth` 기준 연동

**제외 (Out of Scope)**

- 없음

## 🛠️ 접근 방식

- **라우팅**: `app/(auth)/login`, `app/(auth)/signup` 라우트 그룹 신설 — 기존 `(main)` 그룹과 동일 패턴
- **API 레이어**: `lib/api/auth.ts` 신규 (기존 `client.ts`의 `apiFetch` 재사용) + `lib/types/auth.ts` 타입 — `signup/login/logout/refresh` 모두 `api-spec.md` 기준
- **폼/유효성 검사**: 새 라이브러리 추가 없이 직접 구현 — 프로젝트가 "의존성 0" 기조(axios 미사용)라 react-hook-form/zod 도입은 컨벤션 위반. `useState` + 직접 검증 헬퍼로 처리
- **서버 통신**: 기존 TanStack React Query `useMutation`으로 login/signup 호출
- **Mock 우선**: `USE_MOCK` 패턴 + MSW 핸들러에 `/auth/*` 추가 → 백엔드 미연동 상태에서 UI 검증
- **토큰**: `client.ts`의 `Authorization` 주입 지점 stub만 잡아두고 실제 JWT 저장/주입은 추후
- **UI 톤**: 별도 디자인 자료 없음 → 현재 서비스 페이지의 뉘앙스에 맞춘 기본 폼으로 구현

## 🔗 참고 자료

| 유형      | 링크                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| Figma     | -                                                                              |
| Storybook | -                                                                              |
| API 명세  | `api-spec.md` (`/auth/signup`, `/auth/login`, `/auth/logout`, `/auth/refresh`) |
| 기타      | -                                                                              |

## 🤔 주요 결정 사항

<!-- /note 또는 수동으로 추가 -->
