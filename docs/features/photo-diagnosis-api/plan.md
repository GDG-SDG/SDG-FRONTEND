# photo-diagnosis-api

| 항목         | 값                                                      |
| ------------ | ------------------------------------------------------- |
| GitHub Issue | #27 — https://github.com/GDG-SDG/SDG-FRONTEND/issues/27 |
| Branch       | feature/27-photo-diagnosis-api                          |
| 작성자       | a1rhun                                                  |
| 작성일       | 2026-06-19                                              |
| Type         | Feat                                                    |

## 🎯 작업 목적

api 갱신에 따른 사진 진단 기능 추가

## 📋 작업 범위

**포함 (In Scope)**

- [ ] `lib/api/diagnose.ts`에 `POST /diagnoses` (multipart/form-data: cropId, location, image) 요청 함수 추가
- [ ] 공통 응답 래퍼(`ApiResponse`) 갱신 반영 — 진단 응답을 `data`에서 언래핑
- [ ] 진단 결과 응답 타입 정의/매핑 (id, cropName, diseaseName, confidence, severity, treatmentStatus, diagnosedAt)
- [ ] `app/(main)/diagnosis/page.tsx`의 mock 진단 흐름을 실 API 연동으로 교체
- [ ] 진단 결과 → 상세 모달/채팅 연계 흐름 연결 (실 진단 id 전달)

**제외 (Out of Scope)**

- (없음)

<!-- 후속 이슈 섹션은 여기 아래로 추가 — v2 자동화 예정 -->

## 🛠️ 접근 방식

[작업 진행하면서 채워주세요]

## 🔗 참고 자료

| 유형      | 링크                                 |
| --------- | ------------------------------------ |
| Figma     | -                                    |
| Storybook | -                                    |
| API 명세  | api-spec.md (`POST /diagnoses` 섹션) |
| 기타      | -                                    |

## 🤔 주요 결정 사항

<!-- /note 또는 수동으로 추가 -->

- API 갱신 핵심 변경: 인증(`/auth/**`)·작물(`/crops`) 제외 모든 응답이 `ApiResponse` 래퍼(`{ success, data }`)로 감싸짐. `POST /diagnoses` 응답도 `data` 언래핑 필요.
- ID가 number → UUID 문자열로 전환되는 흐름 (응답 매핑 시 주의).
