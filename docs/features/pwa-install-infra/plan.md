# pwa-install-infra

| 항목         | 값                                                    |
| ------------ | ----------------------------------------------------- |
| GitHub Issue | #9 — https://github.com/GDG-SDG/SDG-FRONTEND/issues/9 |
| Branch       | feature/9-pwa-install-infra                           |
| 작성자       | a1rhun                                                |
| 작성일       | 2026-06-07                                            |
| Type         | Feat                                                  |

## 🎯 작업 목적

백엔드 API 완성 전 일정 공백 동안, 백엔드와 무관한 PWA 설치 인프라를 미리 구축한다. 사용자가 "홈 화면에 추가"로 앱처럼 설치할 수 있게 만들고, 추후 Capacitor를 통한 앱스토어 확장의 기반을 마련한다.

## 📋 작업 범위

**포함 (In Scope)**

- [ ] `@serwist/next` 도입 및 `next.config.mjs`에 `withSerwist` 래핑
- [ ] `app/manifest.ts` 생성 (앱 이름, 아이콘, theme_color, display: standalone)
- [ ] 아이콘 세트 구성 — 192/512 + maskable, apple-touch-icon (**플레이스홀더로 진행**, 추후 실제 로고 교체)
- [ ] `app/layout.tsx`에 themeColor / appleWebApp 메타 추가
- [ ] `app/sw.ts` 서비스워커 — 정적 자산 precache (기본 캐싱 전략)
- [ ] MSW와 PWA SW 환경 분리 보장 (dev=MSW, prod=Serwist)
- [ ] (선택) `beforeinstallprompt` 기반 설치 UX

**제외 (Out of Scope)**

- API 응답 캐싱 / 오프라인 데이터 동기화 → 백엔드 API 확정 후 별도 작업
- Capacitor 앱스토어 래핑 → 추후 별도 작업
- 실제 브랜드 아이콘 디자인 에셋 (현재는 플레이스홀더)

## 🛠️ 접근 방식

- PWA 라이브러리는 `next-pwa`의 후속작인 **Serwist (`@serwist/next`)** 사용 — Next 14 App Router 완전 지원, TS 친화.
- 기존 MSW 서비스워커(`public/mockServiceWorker.js`)는 `USE_MOCK` 플래그(개발 전용)로만 동작하므로, PWA SW는 **프로덕션 빌드에서만 등록**하여 환경으로 분리. dev=MSW / prod=Serwist.
- manifest는 App Router 네이티브 방식(`app/manifest.ts`)으로 작성.

## 🔗 참고 자료

| 유형      | 링크                                        |
| --------- | ------------------------------------------- |
| Figma     | -                                           |
| Storybook | -                                           |
| API 명세  | -                                           |
| 기타      | Serwist 공식 문서 https://serwist.pages.dev |

## 🤔 주요 결정 사항

- [2026-06-07] 캐싱은 "정적 자산 precache" 기본 수준만. API 캐싱은 백엔드 확정 후로 분리.
- [2026-06-07] 아이콘은 플레이스홀더로 시작, 추후 실제 로고로 교체.
