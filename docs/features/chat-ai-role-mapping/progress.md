# chat-ai-role-mapping — 진행 상황

## 📌 현재 작업

- 이슈: #23 (Fix)
- 브랜치: fix/chat-ai-role-mapping
- 단계: 코드 완료 · PR #24 배포됨 · 실 API 검증 대기
- 마지막 업데이트: 2026-06-18 (세션 핸드오프)

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

---

## 🔁 세션 핸드오프 (다음 세션에서 이어가기)

### 현재 상태 (코드/배포)

- 브랜치: `fix/chat-ai-role-mapping` (main 기반) — 최신 커밋 `c90f8bc`, push 완료, 작업 트리 clean
- 이슈 #23 / PR #24 — Closes #23, Vercel 배포 SUCCESS
- 프리뷰: https://sdg-frontend-git-fix-chat-ai-role-mapping-a1rhuns-projects.vercel.app
- 정적검증: `tsc --noEmit` 통과

### 다음 세션 TODO

1. **프리뷰 실기기 검증** — AI 답장이 왼쪽 흰 버블+로봇 아이콘, 시간(HH:MM) 표시, 내 메시지는 오른쪽 초록 유지, `verified` 배지 정상
2. 이상 없으면 **PR #24 머지**
3. 진단 연계 채팅 등 다른 진입 경로도 동일 정상 동작 확인

### 보류 중 결정 — `NEXT_PUBLIC_USE_MOCK`

- 의미: opt-out 방식. `"false"`일 때만 mock OFF → 실 API. 미설정/그 외는 mock ON (`lib/api/client.ts:11`).
- 실 API 경로: 브라우저는 동일 출처 `/api/*` 호출 → Next rewrites가 Cloud Run 백엔드로 프록시
  (`next.config.mjs` — 기본 origin `https://sdg-backend-307053111333.asia-northeast3.run.app` 박혀 있음, 별도 URL 설정 불필요).
- **실 API로 고정하려면**: Vercel 대시보드 → Settings → Environment Variables에 `NEXT_PUBLIC_USE_MOCK=false` (Production+Preview) 추가 후 **재배포**. (로컬 `.env.local`엔 이미 `false`.)
- ⚠️ 부작용: `false`면 `disable: isDev || useMock`(`next.config.mjs`) 해제로 **Serwist PWA SW(`sw.js`) 활성화** → 오프라인 캐싱 동작 시작, 배포 후 SW 캐시 stale 갱신 주의.
- 미결: Vercel 환경변수에 실제로 `false`가 설정돼 있는지 대시보드에서 확인 필요 (CLI 없어 코드에서 확인 불가).

### 참고: 동시 진행 중인 다른 브랜치

- `fix/20-ios-nav-scroll-fix` (PR #21) — iOS nav 끌림 수정, 별개 작업
- `feature/22-diagnosis-camera-gallery` — 진단 갤러리/카메라 연동, 별개 작업 (이 세션 시작 시 체크아웃돼 있던 브랜치)
