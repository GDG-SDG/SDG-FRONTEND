# accesstoken-memory-silent-refresh — 진행 상황

## 📌 현재 작업

- 이슈: #18 (Fix)
- 브랜치: fix/18-accesstoken-memory-silent-refresh
- 단계: 구현 완료 — 커밋 대기
- 마지막 업데이트: 2026-06-14

---

## [Issue #18] accesstoken-memory-silent-refresh

**Type**: Fix | **시작**: 2026-06-14

### ✅ 완료

- [x] 작업 환경 셋업 (/start 실행)
- [x] accessToken 저장소를 localStorage → 메모리(모듈 변수)로 전환 (`lib/auth/token.ts`)
- [x] 부팅 silent refresh — Providers에서 mock 준비 후 `refresh()` 1회 호출, authReady 게이트 추가 (`app/providers.tsx`)
- [x] 인터셉터 refresh 트리거 401 → (401 || 403) 확장 (`lib/api/client.ts`)
- [x] refresh 실패 시 자동 로그아웃 — `clearTokens()` + `/login` 리다이렉트 (`lib/api/client.ts`)
- [x] nav bar 고정 — `flex-1 overflow-y-auto`에 `min-h-0` 추가 (layout + dashboard/chat/diagnosis)
- [x] nav 떠 보임 보정 — `html, body` 배경을 page-bg 끝색(#ecf1ee)으로 맞춰 100dvh 하단 흰 여백 제거 (`app/globals.css`)
- [x] `tsc --noEmit` 통과
- [x] 런타임 확인 (dev 서버 기동, nav 여백 보정 반영)

### 📝 결정 로그

- [2026-06-14] /start 실행, 작업 환경 셋업 완료
- [2026-06-14] 현황 진단: accessToken은 localStorage 평문 저장(XSS 노출), refreshToken은 HttpOnly 쿠키(안전). 백엔드는 만료 시 403 반환하나 인터셉터는 401만 refresh 트리거 → 계약 불일치로 자동 재발급 미동작.
- [2026-06-14] nav 고정 근본 원인: 공통 레이아웃 `flex-1 overflow-y-auto`에 `min-h-0` 누락 → flex 자식이 콘텐츠 높이만큼 늘어나 nav를 viewport 밖으로 밀어냄. mypage만 루트가 `h-full overflow-y-auto` 단일 스크롤이라 우연히 정상 동작했음.

### 🐛 트러블슈팅

- ESLint 미설정 상태(`next lint`가 대화형 셋업을 띄움) → 이번 작업에서는 검증을 `tsc --noEmit`로 대체.

### ⏭️ 남은 작업

- [ ] PR 생성 (`/pr`) → main 머지 시 #18 자동 종료
- [ ] 실백엔드에서 403 만료→자동 재발급 / refresh 실패→자동 로그아웃 최종 확인

### Commit — 2026-06-14

- Hash: `fdb9c52`
- Message: `Fix:#18 accessToken 메모리 전환 및 부팅 silent refresh·nav 고정 적용`
- Issue: `#18` (Closes)

**변경 요약**

- accessToken 저장소 localStorage → 메모리 모듈 변수 전환 (XSS 노출 제거)
- Providers 부팅 silent refresh + authReady 게이트로 새로고침 후 로그인 복구
- 인터셉터 refresh 트리거 401 → (401 || 403), refresh 실패 시 clearTokens + `/login` 리다이렉트
- 공통 레이아웃·중첩 스크롤러에 `min-h-0` 추가 → 하단 nav 고정
- `html, body` 배경을 page-bg 끝색(#ecf1ee)으로 맞춰 100dvh 하단 흰 여백 제거

**결정 로그**

- 단일 커밋으로 묶음 (인증 흐름 + nav 고정이 한 이슈 범위라 분리 불필요), `Closes #18` 적용
- nav 보정은 safe-area 패딩 대신 body 배경 매칭으로 처리 (패딩 증가 시 오히려 더 떠 보임)

**다음 작업**

- `/pr`로 PR 생성
