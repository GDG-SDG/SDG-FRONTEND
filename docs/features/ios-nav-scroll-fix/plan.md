# ios-nav-scroll-fix

| 항목         | 값                                                      |
| ------------ | ------------------------------------------------------- |
| GitHub Issue | #20 — https://github.com/GDG-SDG/SDG-FRONTEND/issues/20 |
| Branch       | fix/20-ios-nav-scroll-fix                               |
| 작성자       | a1rhun                                                  |
| 작성일       | 2026-06-17                                              |
| Type         | Fix                                                     |

## 🎯 작업 목적

iOS Safari(in-browser)에서 콘텐츠가 적은 페이지(채팅 등)를 스크롤할 때, 문서(body) 고무줄 바운스(overscroll)로 `100dvh` 컨테이너째 끌려 올라가며 하단 nav가 함께 밀리는 현상을 막아, 모든 페이지에서 nav를 고정한다.

## 📋 작업 범위

**포함 (In Scope)**

- [x] `globals.css`: `body`를 `position: fixed; inset: 0; overflow: hidden; overscroll-behavior: none`로 고정해 문서 자체 스크롤·바운스 차단
- [x] `(main)/layout.tsx`: 메인 스크롤 컨테이너에 `overscroll-contain` 추가
- [x] `mypage/page.tsx`, `chat/page.tsx`: 내부 스크롤러에 `overscroll-contain` 추가 (바운스 전파 차단)
- [ ] 실기기(iOS Safari) 프리뷰에서 채팅·마이페이지 스크롤 시 nav 고정 검증

**제외 (Out of Scope)**

- 키보드 포커스 시 레이아웃 보정 (이상 발생 시 후속 이슈로 분리)
- 설치형 PWA(standalone) 전용 동작 — 본 수정은 in-browser/standalone 공통 적용

## 🛠️ 접근 방식

- 페이지별 구조 변경이 아니라 전역 root(`html`/`body`) 스크롤 잠금으로 근본 원인 차단.
- 실제 스크롤은 기존 내부 `overflow-y-auto` 컨테이너가 전담하고, `overscroll-contain`으로 바운스가 상위로 전파되지 않게 한다.

## 🔗 참고 자료

| 유형      | 링크 |
| --------- | ---- |
| Figma     | -    |
| Storybook | -    |
| API 명세  | -    |
| 기타      | -    |

## 🤔 주요 결정 사항

- body 고정(`position: fixed`)이 iOS에서 입력창 포커스 시 화면 밀림을 유발할 수 있어, 문제 시 `overscroll-behavior: none` 단독 방식으로 대체 검토.
