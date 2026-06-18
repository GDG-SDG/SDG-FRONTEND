# chat-ai-role-mapping — 진행 상황

## 📌 현재 작업

- 이슈: #23 (Fix)
- 브랜치: fix/chat-ai-role-mapping
- 단계: Phase 1 시작
- 마지막 업데이트: 2026-06-18

---

## [Issue #23] chat-ai-role-mapping

**Type**: Fix | **시작**: 2026-06-18

### ✅ 완료

- [x] 작업 환경 셋업 (/start 실행)
- [x] `lib/api/chat.ts` 정규화 매퍼(`RawChatMessage` → `ChatMessage`) 추가
- [x] role `"assistant"` → `"ai"` 정규화, `createdAt` → `timestamp` 변환
- [x] `getChatMessages` / `sendChatMessage` 적용
- [x] `tsc --noEmit` 통과

### 🚧 진행 중

- [ ] 프리뷰(실 API)에서 AI 답장 왼쪽 버블·시간 정상 표시 검증

### 📝 결정 로그

- [2026-06-18] /start 실행, 작업 환경 셋업 완료
- [2026-06-18] 컴포넌트·mock 대신 API 경계(lib/api/chat.ts)에서 DTO 정규화로 계약 차이 흡수 결정

### 🐛 트러블슈팅

- 증상: AI 답장이 전부 오른쪽(내 메시지) 초록 버블로 렌더. 원인: 실 API `role: "assistant"`인데 컴포넌트가 `role === "ai"`만 AI로 취급. mock은 `"ai"`라 안 드러났음.

### ⏭️ 남은 작업

- 실 API 검증 후 다른 채팅 진입 경로(진단 연계 채팅 등)에서도 동일 정상 동작 확인
