# photo-diagnosis-api — 진행 상황

## 📌 현재 작업

- 이슈: #27 (Feat)
- 브랜치: feature/27-photo-diagnosis-api
- 단계: 실 백엔드 연동 동작 확인 + 콜드스타트 완화 적용 (타입체크 통과)
- 마지막 업데이트: 2026-06-21

---

## [Issue #27] photo-diagnosis-api

**Type**: Feat | **시작**: 2026-06-19

### ✅ 완료

- [x] 작업 환경 셋업 (/start 실행)
- [x] `lib/api/diagnose.ts`에 `createDiagnosis` (`POST /diagnoses`, multipart: cropId·location·image) 추가
- [x] `CreateDiagnosisRequest` 타입 추가 (`lib/types/diagnosis.ts`)
- [x] `useCreateDiagnosis` 뮤테이션 훅 추가 (성공 시 목록·통계 invalidate)
- [x] MSW `POST /diagnoses` 핸들러 추가 (mock id=101 고정 → 후속 상세/유사사례 연계 동작)
- [x] 진단 페이지 mock 시뮬레이션 → 실 API 연동 교체
  - 파일 업로드 → `createDiagnosis` → 응답 id로 `useDiagnosisDetail`·`useSimilarCases` 조회
  - 결과 헤더/병해 설명/유사 사례/방제 단계/병변 박스를 실 데이터로 렌더
  - "AI 상담 시작하기" → `/chat?diagnosisId={id}` 로 실 진단 id 전달
- [x] 타입체크(tsc) 통과, 프로덕션 빌드 성공

#### 실 백엔드 응답으로 계약 정정 (api-spec 문서 ≠ 실제) — 2026-06-21

- [x] 실응답 확인 결과 `POST /diagnoses`가 **요약이 아니라 상세 전체(results[])를 반환**하고 **id는 UUID 문자열**임을 확인 → 문서가 outdated
- [x] `DiagnoseResponse`를 상세 전체 형태로 정정(`imageUrl·location·weather·results[]`, string id, nullable·빈배열), `DiagnoseResultItem` 추가
- [x] 진단 페이지: **2차 GET 제거** — POST 응답을 그대로 `result` state에 담아 바로 렌더 (UUID id로 chat 연계)
- [x] `useSimilarCases`/`getSimilarCases`/`keys.similarCases` id를 `string | number`로 완화 (UUID 허용, 기존 number 호환)
- [x] MSW POST mock도 새 shape(상세 전체·string id)로 갱신
- [x] `getSeverityColor`에 `default` 폴백 추가 — 백엔드가 매핑 외/null severity를 줄 때 `colors.dot` 런타임 크래시(DiagnosisCard) 방지

#### 콜드 스타트 완화 — 2026-06-21

- [x] 진단 페이지 진입 시 **워밍업 핑**(`getCrops()` fire-and-forget)으로 컨테이너 콜드 스타트 선당김
- [x] 분석 15초 초과 시 "첫 진단은 서버 준비로 1~2분" 안내 문구 노출(`longWait`)
- [x] POST 실패 시 **graceful 처리** — 기록 목록 invalidate + "잠시 후 기록에서 확인" 안내 (백엔드가 저장은 끝냈을 수 있어 일부러 abort 안 함)
- [x] `app/providers.tsx`: 부팅 silent refresh 동안 `return null`(흰 화면) → **스플래시 화면**(스피너+로고, 4초 후 "서버 준비 중" 안내). auth 로직 불변

#### 실 위치 정보 연동 (GPS + 역지오코딩) — 2026-06-21 완료

- [x] `app/geocode/route.ts` — 서버 전용 Kakao 프록시. `GET /geocode?lat&lng` → `coord2regioncode` → `{ location: "경기도 이천시" }`. 키 미설정 503, 좌표 누락 400, 행정동(H) 우선
- [x] `lib/api/geocode.ts` — `resolveCurrentLocation(fallback)`: 브라우저 GPS 좌표 → `/geocode` 역지오코딩. 권한 거부·미지원·타임아웃(8s)·실패 시 fallback 반환
- [x] `app/(main)/diagnosis/page.tsx` — 진입 시 `location` state를 GPS로 해석(`useEffect`), 촬영 제출(`createDiagnosis`)에 `location` 사용, 상단 `MapPin` 라벨도 해석된 시·군·구로 표시
- [x] `DEFAULT_LOCATION`은 폴백 용도로 유지(하드코딩 제거가 아니라 폴백으로 강등), `.env.example`에 `KAKAO_REST_KEY` 안내 추가
- [x] tsc 통과
- **선결 조건(사용자)**: Kakao REST 키 발급 후 `.env.local`에 `KAKAO_REST_KEY` 추가 (미설정 시 폴백으로 동작 — 기능은 막히지 않음)

### 🚧 진행 중

- (없음 — 코드 리뷰 / PR 대기)

### 📝 결정 로그

- [2026-06-19] /start 실행, 작업 환경 셋업 완료
- [2026-06-19] API 갱신 핵심: `ApiResponse` 공통 래퍼 도입(인증·작물 제외), ID number→UUID 전환
- [2026-06-19] `ApiResponse` 언래핑은 `lib/api/client.ts`(125-131행)에 이미 구현되어 별도 작업 불필요로 판단
- [2026-06-21] **실응답 확인 → api-spec 문서가 outdated**: POST 응답은 요약이 아니라 상세 전체, id는 UUID 문자열. 2차 GET 없이 POST 응답을 직접 렌더하도록 계약 정정 (국소 수정 방침 = 기존 GET 목록/상세 number 타입은 유지)
- [2026-06-21] `POST /diagnoses` 첫 호출 지연/응답없음은 **Cloud Run 콜드 스타트 + YOLO 모델 로딩**이 원인(2번째부터 빠름). 응답이 끊겨도 백엔드는 저장 완료 → 기록엔 나타남. 프론트는 완화만 가능, 근본은 백엔드 min-instances/preload
- [2026-06-21] 웹 초기 로딩 흰 화면도 같은 콜드 스타트(부팅 `POST /auth/refresh`에 전체 렌더가 게이트됨)가 원인 → 스플래시로 체감 개선
- [2026-06-21] 위치 연동: GPS는 좌표만 주고 API `location`은 행정구역 문자열 → 역지오코딩 필요. **Kakao Local** 채택. 키 노출/CORS 회피 위해 클라 직호출 대신 **서버 전용 키 + Next 프록시(`/geocode`)** 로 동일 출처 원칙 유지. 위치는 부가정보이므로 어느 단계 실패해도 폴백으로 진단 흐름 비차단

### 🐛 트러블슈팅

- `npm run lint`는 ESLint 미구성 상태(대화형 프롬프트)라 실행 불가 → tsc + build로 검증 대체
- dev 서버 떠 있는 상태에서 `npm run build`를 돌려 `.next` 청크 손상(`Cannot find module './682.js'`) 발생 → `rm -rf .next` 후 dev 재시작으로 복구. 이후 검증은 `tsc --noEmit`만 사용

### 🔗 백엔드 요청 (별도 공유 필요)

- `POST /diagnoses` 콜드 스타트 개선: Cloud Run `min-instances ≥ 1`, 모델 preload(또는 워밍업 엔드포인트), (옵션) 비동기 잡 방식. `/auth/refresh` 포함 모든 첫 호출이 같이 빨라짐
- api-spec 문서 정정 요청: `POST /diagnoses` 응답 형태(상세 전체)·id 타입(UUID) 실제와 맞추기

### ⏭️ 남은 작업

- [x] 실 위치 정보 연동 — GPS + Kakao 역지오코딩 적용 (위 완료 항목 참고)
- [ ] 진단 도메인 전체 id를 UUID로 통일할지 결정 (현재 목록/상세 GET 타입은 number 유지 = 국소 수정)
- [ ] chat 추천질문 "정상" 버그: `buildDiagnosisQuestions`가 `results[0]` 대신 `rank===1` 대표 결과를 쓰도록 수정 (미적용)
- [ ] 코드 리뷰 (/review) 및 PR (/pr) — 사진 진단(#27)과 그 외(채팅 lazy 세션·콜드스타트 완화)를 커밋 분리

### 📎 범위 외 함께 작업한 항목 (#27 밖, 커밋 분리 권장)

- 채팅 세션 **lazy 생성**(첫 메시지에만 생성) + 빈 세션 숨김([chat/page.tsx](<../../../app/(main)/chat/page.tsx>)) — 빈 대화기록 누적 방지
- 콜드 스타트 완화(진단 워밍업·`providers.tsx` 스플래시)
