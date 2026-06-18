# chat-ai-role-mapping

| 항목         | 값                                                      |
| ------------ | ------------------------------------------------------- |
| GitHub Issue | #23 — https://github.com/GDG-SDG/SDG-FRONTEND/issues/23 |
| Branch       | fix/chat-ai-role-mapping                                |
| 작성자       | a1rhun                                                  |
| 작성일       | 2026-06-18                                              |
| Type         | Fix                                                     |

## 🎯 작업 목적

실제 백엔드 채팅 응답이 `role: "assistant"` / `createdAt`로 오는데, 프론트는 `role: "ai"` / `timestamp`만 인식해 AI 답장이 전부 내 메시지(오른쪽 초록 버블)로 잘못 렌더되는 문제를 수정한다.

## 📋 작업 범위

**포함 (In Scope)**

- [x] `lib/api/chat.ts`에 서버 DTO(`RawChatMessage`) → 프론트 `ChatMessage` 정규화 매퍼 추가
- [x] role 정규화: `"user"` 외에는 모두 `"ai"` (백엔드 `"assistant"`, mock `"ai"` 양쪽 호환)
- [x] 시간 정규화: `createdAt`(ISO) → `timestamp`(HH:MM), 없으면 현재시각
- [x] `getChatMessages` / `sendChatMessage` 양쪽에 매퍼 적용
- [ ] 프리뷰(실 API)에서 AI 답장이 왼쪽 버블·시간 정상 표시 검증

**제외 (Out of Scope)**

- 컴포넌트(`chat/page.tsx`)·mock 데이터 구조 변경 (계약 정규화는 API 경계에서만)
- `verified`/`source` 외 추가 메타 필드 매핑

## 🛠️ 접근 방식

- 컴포넌트나 mock을 고치지 않고 **API 경계(`lib/api/chat.ts`)에서 DTO를 정규화**해, mock과 실 API 계약 차이를 한곳에서 흡수.
- `apiFetch`가 이미 `{ success, data }` 래퍼를 언래핑하므로 매퍼는 순수 필드 변환만 담당.

## 🔗 참고 자료

| 유형      | 링크                      |
| --------- | ------------------------- |
| Figma     | -                         |
| Storybook | -                         |
| API 명세  | api-spec.md (chat 메시지) |
| 기타      | -                         |

## 🤔 주요 결정 사항

- 실 API role 값이 `"assistant"`라도 프론트 타입은 `"ai" | "user"` 유지 — 화면/mock 영향 최소화 위해 경계에서만 매핑.
