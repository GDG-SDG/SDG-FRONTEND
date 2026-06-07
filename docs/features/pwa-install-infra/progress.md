# pwa-install-infra — 진행 상황

## 📌 현재 작업

- 이슈: #9 (Feat)
- 브랜치: feature/9-pwa-install-infra
- 단계: Phase 1 시작
- 마지막 업데이트: 2026-06-07 (start 실행)

---

## [Issue #9] pwa-install-infra

**Type**: Feat | **시작**: 2026-06-07

### ✅ 완료

- [x] 작업 환경 셋업 (/start 실행)
- [x] `@serwist/next` + `serwist` 설치, `next.config.mjs`에 `withSerwist` 래핑
- [x] `app/sw.ts` 서비스워커 — 정적 자산 precache (defaultCache)
- [x] `app/manifest.ts` 생성 (standalone, theme #2D7A3E)
- [x] 플레이스홀더 아이콘 생성 (`scripts/gen-placeholder-icons.mjs` → public/icons/\*)
- [x] `app/layout.tsx`에 manifest/appleWebApp/icons + viewport.themeColor 추가
- [x] MSW ↔ PWA SW 환경 분리 (`disable: isDev || useMock`)

- [x] prod 빌드 검증 — USE_MOCK=false 시 `public/sw.js`(54KB) 생성 + `/manifest.webmanifest` 라우트, type-check 클린

- [x] `beforeinstallprompt` 기반 설치 UX — `components/pwa/InstallPrompt.tsx`, `(main)` 레이아웃 마운트. Android=설치 버튼 / iOS=수동 안내 / standalone·dismiss 시 미노출. type-check·build 통과

### 🚧 진행 중

- [ ] 브라우저 실측 — Lighthouse PWA / 실제 설치 동작 확인 (배포 또는 npm start 환경에서)

### 📝 결정 로그

- [2026-06-07] /start 실행, 작업 환경 셋업 완료
- [2026-06-07] PWA 라이브러리 Serwist 채택, 캐싱은 정적 자산 precache 기본 수준만 (API 캐싱은 백엔드 확정 후 분리)
- [2026-06-07] 아이콘은 플레이스홀더로 시작
- [2026-06-07] **SW 충돌 회피**: MSW 워커와 PWA 워커 모두 루트 스코프(/)라 동시 등록 불가 → mock 모드(USE_MOCK!=false)에서는 PWA SW 비활성. 백엔드 연동(USE_MOCK=false) 시 PWA SW 활성. manifest/아이콘은 항상 제공되어 설치는 mock 모드에서도 동작.
- [2026-06-07] sw.ts는 `/// <reference lib="webworker" />`로 webworker 타입만 국소 적용 (전역 tsconfig는 dom 유지)

### 🐛 트러블슈팅

<!-- /note troubleshoot 으로 추가 -->

### ⏭️ 남은 작업

- [ ] `app/manifest.ts` 생성 (앱 이름, 아이콘, theme_color, display: standalone)
- [ ] 아이콘 세트 구성 — 192/512 + maskable, apple-touch-icon (플레이스홀더)
- [ ] `app/layout.tsx`에 themeColor / appleWebApp 메타 추가
- [ ] `app/sw.ts` 서비스워커 — 정적 자산 precache
- [ ] MSW와 PWA SW 환경 분리 보장 (dev=MSW, prod=Serwist)
- [ ] (선택) `beforeinstallprompt` 기반 설치 UX
- [ ] 검증: `npm run build && npm start`로 설치 가능 여부 / Lighthouse PWA 체크
