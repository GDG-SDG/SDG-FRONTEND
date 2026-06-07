# design-improvement — 진행 상황

## 📌 현재 작업

- 이슈: #7 (Feat)
- 브랜치: feature/7-design-improvement
- 단계: Phase 1 시작
- 마지막 업데이트: 2026-06-06 10:33

---

## [Issue #7] design-improvement

**Type**: Feat | **시작**: 2026-06-06

### ✅ 완료

- [x] 작업 환경 셋업 (/start 실행)
- [x] 현재 화면 분석 (dashboard/diagnosis 모달, mypage 통계 카드)
- [x] 공통 `DiseaseDetailModal` 추출 + 색 토큰화 → dashboard 적용 (tsc 통과, /dashboard 200)
- [x] diagnosis 결과 패널 색 토큰화 (구조·데모 유지, tsc 통과, /diagnosis 200)

- [x] DiagnosisCard 리디자인 — 작물/심각 두 pill 경쟁 해소 (작물=중립 텍스트로 강등, 심각도=좌측 컬러 엣지+단일 배지로 단일화). tsc 통과, /dashboard 200
- [x] DiseaseDetailModal 헤더 리디자인 — flat 컬러 바 → glass 정렬(다크 타이틀 + 심각도 pill, glass 닫기 버튼, 백드롭 blur), 푸터 글래스 톤화
- [x] DiseaseDetailModal 본문 회색감 제거 — 컨테이너를 라이트 그린 글래스(화이트→연그린 그라데이션 + blur/그림자)로, 쿨그레이 구분선·출처 박스를 그린 틴트로 교체. tsc 통과, /dashboard 200

### 🚧 진행 중

- [ ] (없음)

### 📝 결정 로그

- [2026-06-06 10:33] /start 실행, 작업 환경 셋업 완료
- [2026-06-06 10:33] 디자인 변경 전 현재 화면 먼저 확인하기로 함 (스크린샷 ↔ 실제 렌더 대조)
- [2026-06-06 10:33] 일관성 붕괴 근원 = 매직 헥사 복붙(브랜드 초록 #2D7A3E는 이미 `--glass-accent` 토큰 존재) + 모달 마크업 복붙 후 갈라짐
- [2026-06-06 10:33] globals.css에 시맨틱 토큰 추가: `--brand-green` `--accent-orange` `--info-blue`. 심각도 색은 기존 `getSeverityColor` 유틸 단일 소스 유지
- [2026-06-06 10:33] Step A: dashboard 인라인 모달(~264줄)을 `components/disease/DiseaseDetailModal.tsx` 호출로 교체
- [2026-06-06 10:33] 발견: diagnosis 데모는 API 타입(DiagnosisDetail)이 아닌 더 리치한 프리폼 하드코딩 → 공통 컴포넌트에 그대로 못 넣음
- [2026-06-06 10:33] 결정(B): diagnosis는 "토큰화만" — 데모 충실도 유지 위해 색만 토큰/getSeverityColor로 교체. 진짜 컴포넌트 공유는 AI 연동으로 실데이터 들어올 때
- [2026-06-06 10:33] 범위: 깊이 선택이 "모달 공통화 + 토큰"이라 mypage 통계 카드 토큰화는 보류(plan In Scope에는 있음 → 후속)
- [2026-06-06] 카드 클러터 진단: 작물 pill(초록)·심각도 pill(빨강)이 인접 두 줄에서 동급 경쟁 → 심각도를 유일 강조(좌측 컬러 엣지 + 배지)로 두고 작물은 중립 텍스트로 강등
- [2026-06-06] 모달 헤더가 머티리얼 flat 컬러 바라 글래스 톤과 불일치 → 헤더를 글래스 정렬(다크 타이틀 + 심각도 pill로 카드 배지와 통일), 닫기 버튼/푸터/백드롭도 글래스화
- [2026-06-07] 모달 본문 "회색감" 원인 = glass-card-strong(흰 0.72)이 다크 백드롭 위에서 회백색 + 쿨그레이(#F5F5F5) 구분선/출처. 해결: 컨테이너를 불투명도 높은 라이트 그린 글래스로, 그레이를 그린 틴트로 통일 (diagnosis 인라인 패널은 라이트 배경 위라 회색 현상 없어 제외)
- [2026-06-07] 카드 좌측 컬러 엣지 스트립이 "별로" 피드백 → 제거. 심각도는 배지로 단일화, 라이트 보더+은은한 그림자(선택 시 그린 보더/그림자)로 깔끔하게. 썸네일 병변 박스(기능 마커)는 유지

### 🐛 트러블슈팅

<!-- /note troubleshoot 으로 추가 -->

### ⏭️ 남은 작업

- [x] 통계 카드(총 진단 / 이번 달 / 방제 완료) — `24건` 한 줄(baseline 정렬) + 색쌍 토큰화(bg는 토큰 0.1 alpha 파생). tsc 통과, /mypage 200
