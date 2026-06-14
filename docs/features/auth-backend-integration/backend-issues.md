# 백엔드 전달용 — API 이슈 정리 (auth-backend-integration)

> 작성: 2026-06-10 / 최종 업데이트: 2026-06-12 / 대상 배포: `https://sdg-backend-307053111333.asia-northeast3.run.app`
> 프론트(`NEXT_PUBLIC_USE_MOCK=false`)를 실제 배포 백엔드에 붙이며 발견한 이슈 모음.
> 모든 항목은 아래 curl로 재현 가능. (프론트 코드 문제 아님 — 백엔드 수정 필요)

## 요약

| #   | 이슈                              | 현재                 | 기대            | 심각도        |
| --- | --------------------------------- | -------------------- | --------------- | ------------- |
| 1   | 발급 토큰으로 보호 API 인증 실패  | ~~401~~ → **200**    | 200             | ✅ 해결(6/12) |
| 2   | 로그인 실패(없는 계정/틀린 비번)  | 500                  | 401             | 🟠 높음       |
| 3   | 회원가입 중복 이메일              | 500                  | 409             | 🟠 높음       |
| 4   | 로그인 실패류 에러코드/메시지     | 전부 동일            | 식별 가능하게   | 🟠 높음       |
| 5   | 응답 스펙 ↔ api-spec 문서 불일치  | 다름                 | 일치(합의)      | 🟡 중간       |
| 6   | refresh 쿠키 속성(Path/SameSite)  | `/api/auth`,Strict   | 경로 일치, None | 🟡 중간       |
| 7   | CORS 미설정                       | 헤더 없음            | 허용 헤더 응답  | 🟡 중간(\*)   |
| 8   | `GET /diagnoses` (진단기록 목록)  | 500                  | 200             | 🟠 높음       |
| 9   | 응답 래퍼 `{success,data}` 불일치 | 대부분 래핑/일부 raw | 전체 통일       | 🟡 중간       |

(\*) 로컬은 Next dev proxy로 우회 중이라 당장은 안 막히지만, 배포 프론트에선 필요.

> **6/12 변경점**: #1(토큰 인증) 해결되어 보호 API 대부분 200. 다만 성공 응답이 `{success,data}` 래퍼로 바뀜(#9), `GET /diagnoses`는 여전히 500(#8). 프론트는 apiFetch에서 래퍼 자동 unwrap + `Mypage.id`를 string(UUID)으로 대응 완료.

---

## 1. (블로커) 발급한 JWT로 보호 API 인증이 안 됨

로그인은 200으로 정상 토큰을 발급하는데, 그 토큰을 `Authorization: Bearer`로 보호 엔드포인트에 보내면 **401**이 난다. **가짜 토큰은 403** → 즉 서명 검증은 통과하지만(진짜 토큰으로 인식) 그 이후 인증을 끝내지 못한다.

```bash
B="https://sdg-backend-307053111333.asia-northeast3.run.app"
# 새 계정 가입 + 로그인으로 토큰 확보
EMAIL="probe_$(date +%s)@test.com"
curl -s -o /dev/null -X POST "$B/auth/signup" -H "Content-Type: application/json" \
  -d "{\"name\":\"t\",\"email\":\"$EMAIL\",\"password\":\"test1234\",\"phone\":\"010-0000-0000\",\"location\":\"x\",\"farmType\":\"노지 재배\"}"
TOKEN=$(curl -s -X POST "$B/auth/login" -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"test1234\"}" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')

curl -s -o /dev/null -w "토큰 O: %{http_code}\n" "$B/users/mypage" -H "Authorization: Bearer $TOKEN"  # 401
curl -s -o /dev/null -w "토큰 X: %{http_code}\n" "$B/users/mypage"                                     # 403
curl -s -o /dev/null -w "가짜  : %{http_code}\n" "$B/users/mypage" -H "Authorization: Bearer fake.x.y" # 403
```

- 응답 본문: `{"success":false,"message":"인증이 필요합니다."}`
- 토큰 payload(디코드): `{"sub":"<email>","iat":...,"exp":...}` (HS512, 만료 15분). `type` 등 추가 claim 없음.
- **영향**: 로그인에 성공해도 마이페이지·진단기록·캘린더 등 인증 필요한 API가 전부 막힘.
- **확인 요청**: ① 토큰 `sub`(이메일)로 사용자 조회가 되는지 ② JWT 필터가 `SecurityContextHolder`에 Authentication을 세팅하는지 ③ access 토큰에 필터가 기대하는 claim이 다 있는지.

---

## 2. 로그인 실패가 500 (401이어야 함)

```bash
# 없는 계정
curl -s -o /dev/null -w "%{http_code}\n" -X POST "$B/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"nobody_xyz@test.com","password":"test1234"}'           # 500
# 있는 계정 + 틀린 비번
curl -s -o /dev/null -w "%{http_code}\n" -X POST "$B/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"me@test.com","password":"WRONGpw999"}'                 # 500
```

- 응답: `{"success":false,"message":"서버 내부 오류가 발생했습니다."}`
- 추정: 사용자 조회 실패(NPE) 또는 `BadCredentialsException`을 401로 매핑하는 핸들러 부재 → generic 500.
- 참고: 입력 필드 누락/빈 body는 이미 **400**으로 정상 처리됨.

---

## 3. 회원가입 중복 이메일이 500 (409여야 함)

```bash
# 이미 존재하는 이메일(test@test.com)로 재가입
curl -s -o /dev/null -w "%{http_code}\n" -X POST "$B/auth/signup" -H "Content-Type: application/json" \
  -d '{"name":"x","email":"test@test.com","password":"test1234","phone":"010-9999-9999","location":"서울","farmType":"과수원"}'  # 500
# 새 이메일이면
curl -s -o /dev/null -w "%{http_code}\n" -X POST "$B/auth/signup" -H "Content-Type: application/json" \
  -d "{\"name\":\"x\",\"email\":\"new_$(date +%s)@test.com\",\"password\":\"test1234\",\"phone\":\"010-9999-9999\",\"location\":\"서울\",\"farmType\":\"과수원\"}"  # 201
```

- 응답: `{"success":false,"message":"서버 내부 오류가 발생했습니다."}`
- 기대: **409 Conflict** + "이미 가입된 이메일입니다" 류 메시지.
- (선택) 실시간 중복 검사용 `GET /auth/email-exists?email=` 엔드포인트가 있으면 프론트가 입력 중 안내 가능.

---

## 4. 실패 응답의 에러코드/메시지가 구분되지 않음

현재 인증 실패·중복·서버 장애가 **모두 500 + `"서버 내부 오류가 발생했습니다"`** 로 동일하게 내려와, 프론트가 원인을 구별할 수 없음 → 사용자에게 정확한 안내(예: "이메일 또는 비밀번호가 올바르지 않습니다")를 띄울 수 없음.

- 요청: 상황별로 **HTTP 상태코드 + 식별 가능한 에러코드(또는 고유 message)** 를 구분해서 응답.
  - 예) `401 AUTH_INVALID_CREDENTIALS`, `409 EMAIL_DUPLICATED`, `401 TOKEN_INVALID` 등.

---

## 5. 응답 스펙 ↔ api-spec.md 문서 불일치

문서(`api-spec.md`)와 실제 배포 응답이 다름. 어느 쪽을 정답으로 할지 합의 필요.

### 로그인 `POST /auth/login`

| 항목         | api-spec 문서                         | 실제 배포                          |
| ------------ | ------------------------------------- | ---------------------------------- |
| 응답 body    | `{ accessToken, refreshToken, user }` | `{ accessToken, tokenType }`       |
| refreshToken | body에 포함                           | `Set-Cookie`(HttpOnly)로만 전달    |
| user 정보    | 포함                                  | 없음 (→ `/users/mypage` 별도 조회) |

실제 응답 예:

```json
{ "accessToken": "eyJ...", "tokenType": "Bearer" }
```

```
set-cookie: refresh_token=...; Path=/api/auth; Max-Age=604800; Secure; HttpOnly; SameSite=Strict
```

### 회원가입 `POST /auth/signup`

| 항목      | api-spec 문서         | 실제 배포                                |
| --------- | --------------------- | ---------------------------------------- |
| 응답 body | `{ userId: 1 }`(숫자) | `{ id, email, name }` (id는 UUID 문자열) |

실제 응답 예:

```json
{
  "id": "494c67f4-ac79-4403-bfd3-3f520d6b1044",
  "email": "me@test.com",
  "name": "김농부"
}
```

> 프론트 타입(`LoginResponse`,`SignupResponse`)은 현재 **실제 배포 응답** 기준으로 맞춰둔 상태.
> 백엔드가 문서대로 맞출지, 문서를 실제에 맞게 갱신할지 결정 필요.

---

## 6. refresh 쿠키 속성

```
set-cookie: refresh_token=...; Path=/api/auth; Secure; HttpOnly; SameSite=Strict
```

- **Path 불일치**: 쿠키 Path가 `/api/auth`인데 실제 라우트는 `/auth/*` (context-path 없음 — `/api/*`로 호출하면 500). 따라서 브라우저가 `/auth/refresh`에 쿠키를 안 보냄 → refresh 동작 불가. → Path를 `/auth`(또는 `/`)로.
- **SameSite=Strict**: 프론트와 백엔드가 다른 사이트면 크로스사이트 요청에 쿠키가 안 실림. 직접 연동(프록시 미사용) 하려면 `SameSite=None; Secure` 필요.
  - 현재 로컬은 Next dev proxy로 동일 사이트화하여 우회 중이라 당장은 무관.

---

## 7. CORS 미설정

```bash
curl -s -i -X OPTIONS "$B/diagnoses" \
  -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: GET" | head
```

- 응답에 `Access-Control-Allow-Origin` 등 CORS 헤더가 **하나도 없음** (OPTIONS가 200이어도 마찬가지).
- 브라우저 직접 호출 시 모든 크로스오리진 요청이 차단됨.
- 요청: `Access-Control-Allow-Origin`(명시 origin, `*` 불가) + `Access-Control-Allow-Credentials: true` + `Allow-Methods` + `Allow-Headers`.
- 현재 로컬은 Next dev proxy(`/api/*` → 백엔드)로 우회. 배포 프론트에선 필요.

---

## 8. `GET /diagnoses` (진단기록 목록) 500

토큰 인증이 정상화된 뒤에도 진단기록 목록 조회만 500이 난다. (같은 토큰으로 mypage/summary/calendar/chat 등은 200)

```bash
curl -s -o /dev/null -w "%{http_code}\n" "$B/diagnoses" -H "Authorization: Bearer $TOKEN"  # 500
```

- 응답: `{"success":false,"message":"서버 내부 오류가 발생했습니다."}`
- 데이터가 없는 신규 계정에서도 500 → 빈 목록 처리(NPE 등) 의심.

---

## 9. 성공 응답 래퍼 `{success, data}` 불일치

토큰 인증 수정 이후 성공 응답이 대부분 `{"success":true,"data":...}` 형태로 바뀌었는데, 일부 엔드포인트는 래퍼 없이 raw로 응답한다.

| 엔드포인트                     | 응답 형태                       |
| ------------------------------ | ------------------------------- |
| `/users/mypage`                | `{"success":true,"data":{...}}` |
| `/users/mypage/summary`        | `{"success":true,"data":{...}}` |
| `/users/notification-settings` | `{"success":true,"data":{...}}` |
| `/diagnoses/stats/monthly`     | `{"success":true,"data":[]}`    |
| `/calendar/diagnoses`          | `{"success":true,"data":[]}`    |
| `/chat/sessions`               | `{"success":true,"data":[]}`    |
| **`/crops`**                   | **`[]`** (래퍼 없음 — 불일치)   |

- 요청: 전 엔드포인트의 성공 응답 형태를 **하나로 통일**(래퍼 적용 또는 미적용).
- 프론트 대응: `apiFetch`에서 `{success,data}` 래퍼를 자동 unwrap, 래퍼 없는 응답(`/crops`)은 그대로 사용하도록 방어 처리 완료.

### 응답 스펙 추가 불일치 — `Mypage.id`

- api-spec 문서: `id: number` / 실제: **UUID 문자열** (`"11447b07-8f11-46bb-af0f-df1cfe5fd970"`). 프론트 타입은 string으로 수정함.

---

## 프론트 쪽 현황 (참고)

- 토큰 계약(쿠키 기반)·로그인/회원가입/로그아웃 UI·Next dev proxy 구현 완료, type-check 통과.
- #1(JWT 인증) 해결 확인(6/12). 응답 래퍼 unwrap·`Mypage.id` string 대응 완료.
- 남은 백엔드 블로커: #8(`/diagnoses` 500), #2~4(에러코드), #9(래퍼 통일).
- 상세: 같은 폴더 `progress.md` 참고.
