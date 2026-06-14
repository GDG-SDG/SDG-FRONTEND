# auth-backend-integration — 진행 상황

## 📌 현재 작업

- 이슈: #13 (Fix)
- 브랜치: fix/13-auth-backend-integration
- 단계: Phase 1 시작
- 마지막 업데이트: 2026-06-09 21:32

---

## [Issue #13] auth-backend-integration

**Type**: Fix | **시작**: 2026-06-09

### ✅ 완료

- [x] 작업 환경 셋업 (/start 실행)
- [x] `LoginResponse`에서 refreshToken 제거, `RefreshRequest`·`LogoutResponse` 타입 삭제
- [x] `apiFetch`에 `credentials: "include"` 추가 (쿠키 송수신)
- [x] `logout` 204(void) / `refresh` body 없이 쿠키 기반으로 시그니처 수정
- [x] token 저장소 accessToken 단일화 (`setTokens`→`setAccessToken`, refresh 저장 제거)
- [x] mock(`MOCK_LOGIN_RESPONSE`)·MSW handler(logout 204) 정합성
- [x] 배포 주소 반영 + `NEXT_PUBLIC_USE_MOCK=false`
- [x] api-spec.md 상세 섹션 쿠키 계약으로 갱신
- [x] type-check 통과 (`npm run type-check`)

### 🚧 진행 중

- (없음 — 코드 구현 완료)

### 📝 결정 로그

- [2026-06-09 21:32] /start 실행, 작업 환경 셋업 완료
- [2026-06-09 21:32] refreshToken은 HttpOnly 쿠키만 신뢰원, 클라이언트는 accessToken만 저장하기로 결정
- [2026-06-09 21:32] USE_MOCK=false 전체 실연동, 배포 base URL https://sdg-backend-307053111333.asia-northeast3.run.app
- [2026-06-09 21:32] 토큰 계약 반영 코드 구현 완료, type-check 통과
- [2026-06-10 00:10] 브라우저에서 전 요청 403 발생 → 백엔드 CORS 미설정 확인. **Next dev proxy(rewrites)로 동일 출처 우회** 채택.
- [2026-06-10 00:10] 실제 로그인 응답이 `{accessToken, tokenType}` (api-spec의 `user` 없음) 확인 → `LoginResponse` 타입을 실제 응답에 맞춤.
- [2026-06-11] 로그아웃 버튼 연결(`useLogout` — 서버 응답 무관 로컬 토큰 정리 후 /login), 회원가입 연락처 자동 포맷·재배유형 커스텀 드롭다운(`AuthSelect`), 앱 진입 분기(토큰 없으면 /login).
- [2026-06-12] **백엔드 토큰 인증 해결 확인** — 보호 API 대부분 200. 단 성공 응답이 `{success,data}` 래퍼로 바뀜 → `apiFetch`에서 자동 unwrap, `Mypage.id`를 string(UUID)으로 수정. `GET /diagnoses`는 여전히 500.

### 🔧 Next dev proxy 구성

- `next.config.mjs` rewrites: `/api/:path*` → `BACKEND_PROXY_ORIGIN/:path*`
- `NEXT_PUBLIC_API_BASE_URL=/api` (브라우저는 동일 출처만 호출 → CORS preflight 자체가 발생 안 함)
- 검증(curl, 프록시 경유): `POST /api/auth/login` 200 + Set-Cookie 전달, `GET /api/crops` 200(`[]`), 회원가입 201 모두 정상.

### 🐛 트러블슈팅 / 백엔드 이슈 (프론트로는 해결 불가)

1. **CORS 미설정** — OPTIONS가 200이어도 `Access-Control-Allow-Origin` 헤더 자체가 없음. (dev는 프록시로 우회했으나 배포 환경엔 필요)
2. **JWT 검증 실패** — `/auth/login`이 발급한 토큰을 보호 엔드포인트(`/users/mypage`)가 거부(`"인증이 필요합니다"`). 신규 가입 계정으로도 동일 → 백엔드가 자기가 발급한 토큰을 못 받음.
3. **쿠키 `Path=/api/auth`** ↔ 실제 라우트 `/auth/*` 불일치 → 브라우저가 `/auth/refresh`에 refresh 쿠키를 안 보냄.
4. **쿠키 `SameSite=Strict`** → 크로스사이트 미전송 (프록시 사용 시엔 동일사이트라 무관).
5. **`/api/*` 경로는 500** → 백엔드 context-path는 root(`/`). 쿠키 Path만 `/api`로 잘못 박혀 있음.
6. 로그인 응답에 `user` 없음(api-spec과 불일치) → mypage 별도 조회 필요.

### ⏭️ 남은 작업

- [x] ~~#2 JWT 검증~~ → 6/12 해결됨
- [ ] 브라우저에서 로그인→mypage→대시보드 실데이터 렌더 최종 확인 (dev 서버 재시작 필요)
- [ ] **백엔드 남은 건**: `GET /diagnoses` 500, 로그인/가입 실패 에러코드(500→401/409), 응답 래퍼 통일(`/crops`)
- [ ] (후속) 401 응답 시 자동 `refresh` 인터셉터
- 백엔드 전달용 상세: `backend-issues.md`
