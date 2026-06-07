# design-improvement

| 항목         | 값                                                    |
| ------------ | ----------------------------------------------------- |
| GitHub Issue | #7 — https://github.com/GDG-SDG/SDG-FRONTEND/issues/7 |
| Branch       | feature/7-design-improvement                          |
| 작성자       | a1rhun                                                |
| 작성일       | 2026-06-06                                            |
| Type         | Feat                                                  |

## 🎯 작업 목적

화면의 일관성 유지 — 일반 화면은 양호하나 모달 등 액션으로 뜨는 화면의 구성을 개선한다.

## 📋 작업 범위

**포함 (In Scope)**

- [ ] 병해 상세 모달(탄저병 상세 등) 구성·스타일 개선 — `app/(main)/dashboard/page.tsx`, `app/(main)/diagnosis/page.tsx`
- [ ] 통계 카드(총 진단 / 이번 달 / 방제 완료) 정렬·간격 개선 — `app/(main)/mypage/page.tsx`

**제외 (Out of Scope)**

- 일반(비-모달) 화면 디자인 — 현재 양호하다고 판단

<!-- 후속 이슈 섹션은 여기 아래로 추가 — v2 자동화 예정 -->

## 🛠️ 접근 방식

- **디자인 변경 전 현재 화면을 반드시 먼저 확인** — 스크린샷과 실제 렌더를 대조한 뒤 변경.
- 병해 상세 모달이 `dashboard`/`diagnosis`에 중복되어 있으면 공통 컴포넌트로 추출 검토.

## 🔗 참고 자료

| 유형      | 링크                                     |
| --------- | ---------------------------------------- |
| Figma     | -                                        |
| Storybook | -                                        |
| API 명세  | -                                        |
| 기타      | 첨부 스크린샷: 병해 상세 모달, 통계 카드 |

## 🤔 주요 결정 사항

<!-- /note 또는 수동으로 추가 -->
