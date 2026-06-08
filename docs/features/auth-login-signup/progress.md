# auth-login-signup — 진행 상황

## 📌 현재 작업

- 이슈: #11 (Feat)
- 브랜치: feature/11-auth-login-signup
- 단계: Phase 1 — 로그인/회원가입 UI + /auth 연동 구현 완료 (mock 기준)
- 마지막 업데이트: 2026-06-08 23:45

---

## [Issue #11] auth-login-signup

**Type**: Feat | **시작**: 2026-06-08

### ✅ 완료

- [x] 작업 환경 셋업 (/start 실행)
- [x] 로그인 페이지 UI 구현 — `app/(auth)/login/page.tsx`
- [x] 회원가입 페이지 UI 구현 — `app/(auth)/signup/page.tsx` (비밀번호 확인·재배유형 select 포함)
- [x] 폼 유효성 검사 — `lib/validation/auth.ts` (이메일/비밀번호 8자/연락처 형식/필수값)
- [x] api-spec `/auth` 연동 — `lib/api/auth.ts`(signup/login/logout/refresh) + `lib/queries/useAuth.ts`
- [x] 토큰 저장/주입 — `lib/auth/token.ts` + `client.ts` Authorization Bearer 주입
- [x] MSW `/auth/*` mock 핸들러 + `lib/data/mock/auth.ts`
- [x] type-check 통과 + production build 성공 (`/login`, `/signup` 라우트 생성 확인)

### 🚧 진행 중

- [ ] (없음 — Phase 1 완료, 리뷰 대기)

### 📝 결정 로그

- [2026-06-08 23:23] /start 실행, 작업 환경 셋업 완료
- [2026-06-08 23:23] 폼/유효성 검사는 새 라이브러리 없이 직접 구현 (프로젝트 "의존성 0" 기조 — axios·react-hook-form·zod 미도입)
- [2026-06-08 23:23] Mock 우선: USE_MOCK + MSW `/auth/*` 핸들러로 백엔드 미연동 상태 검증
- [2026-06-08 23:45] 라우팅은 `app/(auth)` 라우트 그룹 신설 (기존 `(main)`과 동일 패턴), 공통 레이아웃에 브랜드 로고 + 글래스 카드
- [2026-06-08 23:45] 토큰은 localStorage 최소 구현 — 로그인 성공 시 access/refresh 저장, client.ts에서 Bearer 주입. secure cookie·refresh 회전은 추후
- [2026-06-08 23:45] 로그인 성공 → `/calendar` 리다이렉트, 회원가입 성공 → `/login` 리다이렉트

### 🐛 트러블슈팅

- [2026-06-08 23:45] `next lint`가 eslintrc 미존재로 interactive 설정 프롬프트를 띄움 → 범위 밖이라 강제 구성하지 않고 type-check + build로 검증 대체

### ⏭️ 남은 작업

- [ ] 실제 백엔드 연동 시 `NEXT_PUBLIC_USE_MOCK=false` + 에러 응답 메시지 매핑 확인
- [ ] 로그아웃 UI 연결 (마이페이지 등) — `logout()` API는 준비됨
- [ ] 인증 가드(미로그인 시 보호 라우트 차단) — 별도 이슈 검토

---

### Commit — 2026-06-09 00:05

- Hash: `3e35204`
- Message: `Feat:#11 로그인/회원가입 페이지 구현`
- Issue: `#11`

**변경 요약**

- `app/(auth)` 라우트 그룹 + 로그인/회원가입 페이지, `AuthField` 공통 컴포넌트
- `lib/api/auth.ts`(signup/login/logout/refresh), `useAuth` 뮤테이션 훅
- `lib/validation/auth.ts` 순수 함수 유효성 검사, `lib/auth/token.ts` + client.ts Bearer 주입
- MSW `/auth/*` mock 핸들러 + `lib/data/mock/auth.ts`
- mock 전용 테스트 계정 프리패스 버튼 (`USE_MOCK`일 때만 노출)

**결정 로그**

- 로고는 공통 레이아웃에서 분리 → 로그인 페이지에만 배치 (회원가입은 폼만)
- 테스트 계정 프리패스는 `test@test.com / test1234`, mock 전용으로 운영 빌드 미노출

**다음 작업**

- 실제 백엔드 연동(`NEXT_PUBLIC_USE_MOCK=false`) 시 에러 응답 메시지 매핑 점검
- 로그아웃 UI 연결, 인증 가드(별도 이슈)
