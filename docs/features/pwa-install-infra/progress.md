# pwa-install-infra — 진행 상황

## 📌 현재 작업

- 이슈: #9 (Feat)
- 브랜치: feature/9-pwa-install-infra
- 단계: 1단계(설치 인프라) 구현·런타임 검증 완료
- 마지막 업데이트: 2026-06-08 (런타임 검증)

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
- [x] 오프라인 폴백 페이지 — `app/~offline/page.tsx`, `sw.ts` `fallbacks.entries`(document matcher) + `next.config` `additionalPrecacheEntries`로 문서 precache. 빌드 매니페스트에 `/~offline` 문서 포함 검증
- [x] 앱 바로가기(manifest `shortcuts`) — 진단(/diagnosis)·챗봇(/chat)·캘린더(/calendar) 3종. 런타임 manifest 서빙 검증

### 🚧 진행 중

- [ ] 브라우저 실측 — Lighthouse PWA / 실제 설치 동작 확인 (배포 또는 npm start 환경에서)

### 📝 결정 로그

- [2026-06-07] /start 실행, 작업 환경 셋업 완료
- [2026-06-07] PWA 라이브러리 Serwist 채택, 캐싱은 정적 자산 precache 기본 수준만 (API 캐싱은 백엔드 확정 후 분리)
- [2026-06-07] 아이콘은 플레이스홀더로 시작
- [2026-06-07] **SW 충돌 회피**: MSW 워커와 PWA 워커 모두 루트 스코프(/)라 동시 등록 불가 → mock 모드(USE_MOCK!=false)에서는 PWA SW 비활성. 백엔드 연동(USE_MOCK=false) 시 PWA SW 활성. manifest/아이콘은 항상 제공되어 설치는 mock 모드에서도 동작.
- [2026-06-07] sw.ts는 `/// <reference lib="webworker" />`로 webworker 타입만 국소 적용 (전역 tsconfig는 dom 유지)
- [2026-06-08] 오프라인 폴백: App Router는 HTML 문서를 precache 매니페스트에 자동 포함하지 않아(`__SW_MANIFEST`엔 JS/CSS/media만), 폴백 문서(`/~offline`)는 `additionalPrecacheEntries`로 직접 precache. 폴백 페이지 수정 시 `revision`(현재 `offline-v1`) 동반 증가 필요. 라우트는 literal `/~offline`로만 매칭(URL 인코딩 `%7E`는 404).

### 🐛 트러블슈팅

<!-- /note troubleshoot 으로 추가 -->

### ⏭️ 남은 작업

- [ ] 브라우저 실측 — Lighthouse PWA / 실제 설치 동작 (배포 또는 백엔드 연동 시점 권장)
- [x] ~~플레이스홀더 아이콘~~ → 세이지 그린 타일 + 흰 라인 잎(Lucide leaf) 아이콘 교체 (2026-06-14). `scripts/gen-icons.mjs`(qlmanage+sips 렌더)로 생성, 정식 로고 확정 시 재교체
- [ ] (후속 이슈) API 응답 캐싱·오프라인 — 백엔드 API 확정 후
- [ ] (후속 이슈) Capacitor 앱스토어 래핑

### Commit — 2026-06-07

- Hash: `0888afa`
- Message: `Feat:#9 PWA 설치 인프라 구축`
- Issue: `#9`

**변경 요약**

- Serwist 도입(next.config withSerwist), manifest.ts / sw.ts(정적 precache) 추가
- layout 메타(manifest·appleWebApp·viewport.themeColor) + 플레이스홀더 아이콘 4종
- InstallPrompt 컴포넌트((main) 레이아웃 마운트) — Android 설치 버튼 / iOS 수동 안내
- sw.js 빌드 산출물 .gitignore 처리

**결정 로그**

- mock 모드에서는 PWA SW 비활성(`disable: isDev || useMock`) — MSW와 SW 스코프 충돌 회피
- 이번 커밋은 `Refs #9` (PR 머지 시 Closes 예정)
- `docs/pilot-metrics/`는 PWA 무관 → 커밋에서 제외

**다음 작업**

- 런타임 검증 (npm start)

### 런타임 검증 — 2026-06-08

`NEXT_PUBLIC_USE_MOCK=false` prod 빌드 → `npm start`(:3100)로 산출물 서빙 확인.

| 항목                    | 결과                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `/manifest.webmanifest` | HTTP 200, `application/manifest+json`, JSON 정상(theme #2D7A3E, standalone, 아이콘 3종)      |
| `/sw.js`                | HTTP 200, `application/javascript`, 54,974 bytes, Serwist 번들 확인                          |
| `/icons/*.png` (4종)    | 전부 HTTP 200, `image/png`                                                                   |
| HTML `<head>`           | manifest 링크 / `theme-color` / `apple-mobile-web-app-*` / `apple-touch-icon` 메타 주입 확인 |

**한계**: GUI 브라우저 Lighthouse·실제 설치 프롬프트는 headless로 검증 불가 → 배포/실기기에서 별도 확인 필요.

**다음 작업**

- 실제 브랜드 로고로 아이콘 교체 (자산 준비 시)
- 배포 후 실기기 설치/Lighthouse 확인
