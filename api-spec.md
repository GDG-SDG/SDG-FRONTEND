# API 명세서

> 팜케어 AI Backend API 명세서

## API 구현 현황

> 전체 25개 엔드포인트 중 **23개 구현 완료** (92%)

| #   | 도메인 | Method   | URL                                | 설명                         | 구현 | 비고                                               |
| --- | ------ | -------- | ---------------------------------- | ---------------------------- | :--: | -------------------------------------------------- |
| 1   | 인증   | `POST`   | `/auth/signup`                     | 회원가입                     |  O   |                                                    |
| 2   | 인증   | `POST`   | `/auth/login`                      | 로그인                       |  O   | accessToken만 Body, refreshToken은 HttpOnly Cookie |
| 3   | 인증   | `POST`   | `/auth/logout`                     | 로그아웃                     |  O   | 204 No Content 반환                                |
| 4   | 인증   | `POST`   | `/auth/refresh`                    | 토큰 재발급                  |  O   | refreshToken 쿠키에서 읽고 쿠키로 재발급           |
| 5   | 사용자 | `GET`    | `/users/mypage`                    | 내 정보 조회                 |  O   |                                                    |
| 6   | 사용자 | `PATCH`  | `/users/mypage`                    | 내 정보 수정                 |  O   |                                                    |
| 7   | 사용자 | `PATCH`  | `/users/password`                  | 비밀번호 변경                |  O   |                                                    |
| 8   | 사용자 | `DELETE` | `/users`                           | 회원 탈퇴                    |  O   |                                                    |
| 9   | 사용자 | `GET`    | `/users/mypage/summary`            | 마이페이지 통계              |  O   |                                                    |
| 10  | 사용자 | `GET`    | `/users/notification-settings`     | 알림 설정 조회               |  O   |                                                    |
| 11  | 사용자 | `PATCH`  | `/users/notification-settings`     | 알림 설정 수정               |  O   |                                                    |
| 12  | 작물   | `GET`    | `/crops`                           | 작물 목록 조회               |  O   |                                                    |
| 13  | 진단   | `POST`   | `/diagnoses`                       | 이미지 진단 요청             |      | AI 모델 연동 필요                                  |
| 14  | 기록   | `GET`    | `/diagnoses`                       | 진단 기록 목록 (필터+페이징) |  O   |                                                    |
| 15  | 기록   | `GET`    | `/diagnoses/{id}`                  | 진단 상세 조회               |  O   |                                                    |
| 16  | 기록   | `PATCH`  | `/diagnoses/{id}/treatment-status` | 방제 상태 변경               |  O   |                                                    |
| 17  | 기록   | `GET`    | `/diagnoses/{id}/similar-cases`    | 유사 사례 조회               |  O   |                                                    |
| 18  | 캘린더 | `GET`    | `/calendar/diagnoses`              | 월별 캘린더 기록             |  O   |                                                    |
| 19  | 캘린더 | `GET`    | `/calendar/diagnoses/{date}`       | 특정 날짜 기록               |  O   |                                                    |
| 20  | 통계   | `GET`    | `/diagnoses/stats/monthly`         | 월별 통계                    |  O   |                                                    |
| 21  | 기상   | `GET`    | `/weather/{city}/{district}`       | 지역별 기상 조회             |      | 기상청 API 연동 필요                               |
| 22  | 챗봇   | `POST`   | `/chat/sessions`                   | 채팅 세션 생성               |  O   |                                                    |
| 23  | 챗봇   | `GET`    | `/chat/sessions`                   | 세션 목록 조회               |  O   |                                                    |
| 24  | 챗봇   | `GET`    | `/chat/sessions/{id}/messages`     | 채팅 이력 조회               |  O   |                                                    |
| 25  | 챗봇   | `POST`   | `/chat/sessions/{id}/messages`     | 메시지 전송                  |  O   |                                                    |

### 미구현 사유 요약

| 도메인 | 미구현 엔드포인트 수 | 사유                                     |
| ------ | :------------------: | ---------------------------------------- |
| 진단   |         1개          | AI 진단 모델(이미지 분석) 외부 연동 필요 |
| 기상   |         1개          | 기상청 단기예보 API 외부 연동 필요       |
| 챗봇   |         0개          | AI 응답 생성 포함 구현 완료              |

---

## 공통 응답 래퍼

인증(`/auth/**`)과 작물(`/crops`) 엔드포인트를 제외한 모든 응답은 `ApiResponse` 래퍼로 감싸서 반환한다.

```json
{
  "success": true,
  "data": { ... }
}
```

실패 시:

```json
{
  "success": false,
  "message": "에러 메시지"
}
```

> 아래 각 엔드포인트의 Response 예시는 `data` 내부 값만 표기한다.

---

## 목차

- [인증](#인증)
- [사용자](#사용자)
- [작물](#작물)
- [진단](#진단)
- [기록 / 필터](#기록--필터)
- [캘린더](#캘린더)
- [기상](#기상)
- [챗봇](#챗봇)

---

## 인증

> 인증 엔드포인트는 `ApiResponse` 래퍼 없이 응답한다.

### 회원가입

`POST /auth/signup`

**Request**

```json
{
  "name": "김농부",
  "email": "farmer.kim@example.com",
  "password": "string",
  "phone": "010-1234-5678",
  "location": "경기도 이천시",
  "farmType": "노지 재배"
}
```

**Response** `201 Created`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "farmer.kim@example.com",
  "name": "김농부"
}
```

---

### 로그인

`POST /auth/login`

**Request**

```json
{
  "email": "farmer.kim@example.com",
  "password": "string"
}
```

**Response** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer"
}
```

> refreshToken은 `Set-Cookie` 헤더(HttpOnly, Secure, SameSite=Strict)로 전달된다.

---

### 로그아웃

`POST /auth/logout`

**Request**

없음

> refreshToken은 쿠키에서 읽는다. 쿠키가 없어도 정상 처리된다.

**Response** `204 No Content`

응답 본문 없음.

---

### 토큰 재발급

`POST /auth/refresh`

**Request**

없음 (refreshToken은 쿠키에서 읽음)

**Response** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer"
}
```

> 새 refreshToken은 `Set-Cookie` 헤더로 재발급된다.

---

## 사용자

### 내 정보 조회

`GET /users/mypage`

**Request**

없음

**Response**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "김농부",
  "email": "farmer.kim@example.com",
  "phone": "010-1234-5678",
  "location": "경기도 이천시",
  "farmType": "노지 재배",
  "joinedAt": "2025-03-15"
}
```

---

### 내 정보 수정

`PATCH /users/mypage`

**Request**

```json
{
  "name": "김농부",
  "phone": "010-1234-5678",
  "location": "경기도 이천시",
  "farmType": "노지 재배"
}
```

**Response**

```json
{
  "success": true
}
```

> `data` 없이 성공 여부만 반환한다.

---

### 비밀번호 변경

`PATCH /users/password`

**Request**

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response**

```json
{
  "success": true
}
```

---

### 회원 탈퇴

`DELETE /users`

**Request**

```json
{
  "password": "string"
}
```

**Response**

```json
{
  "success": true
}
```

---

### 마이페이지 통계

`GET /users/mypage/summary`

**Request**

없음

**Response**

```json
{
  "totalDiagnosisCount": 24,
  "monthlyDiagnosisCount": 5,
  "treatmentCompletedCount": 19
}
```

---

### 알림 설정 조회

`GET /users/notification-settings`

**Request**

없음

**Response**

```json
{
  "diagnosisResult": true,
  "treatmentReminder": true,
  "weatherAlert": false
}
```

---

### 알림 설정 수정

`PATCH /users/notification-settings`

**Request**

```json
{
  "diagnosisResult": true,
  "treatmentReminder": true,
  "weatherAlert": true
}
```

**Response**

```json
{
  "success": true
}
```

---

## 작물

> 작물 엔드포인트는 `ApiResponse` 래퍼 없이 응답한다.

### 작물 목록 조회

`GET /crops`

**Request**

없음

**Response**

```json
[
  { "id": 1, "name": "고추" },
  { "id": 2, "name": "토마토" }
]
```

---

## 진단

### 이미지 진단 요청

`POST /diagnoses`

**Request**

`multipart/form-data`: cropId, location, image

**Response**

```json
{
  "id": 101,
  "cropName": "고추",
  "diseaseName": "탄저병",
  "confidence": 92.5,
  "severity": "심각",
  "treatmentStatus": "방제 필요",
  "diagnosedAt": "2026-05-15T19:30:00+09:00"
}
```

---

## 기록 / 필터

### 진단 기록 목록

`GET /diagnoses`

**Request**

Query Parameters: `cropId`, `severity`, `treatmentStatus`, `startDate`, `endDate`, `page`, `size`

**Response**

```json
{
  "content": [
    {
      "id": 101,
      "cropName": "고추",
      "imageUrl": "...",
      "diseaseName": "탄저병",
      "confidence": 92.5,
      "severity": "심각",
      "treatmentStatus": "방제 필요",
      "diagnosedAt": "2026-05-15T19:30:00+09:00",
      "weather": {
        "temperature": 22.0,
        "humidity": 78,
        "precipitation": 3.0
      },
      "description": "잎과 열매에 갈색 반점이 형성되며, 즉시 방제가 필요합니다.",
      "lesionArea": {
        "x": 30.0,
        "y": 25.0,
        "w": 38.0,
        "h": 32.0
      }
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 24
}
```

---

### 진단 상세 조회

`GET /diagnoses/{diagnosisId}`

**Request**

없음

**Response**

```json
{
  "id": 101,
  "cropName": "고추",
  "imageUrl": "...",
  "location": "경기도 이천시",
  "severity": "심각",
  "treatmentStatus": "방제 필요",
  "diagnosedAt": "2026-05-15T19:30:00+09:00",
  "weather": {
    "temperature": 22.0,
    "humidity": 78,
    "precipitation": 3.0
  },
  "results": [
    {
      "id": 1,
      "diseaseName": "Anthracnose",
      "diseaseNameKr": "탄저병",
      "confidence": 92.5,
      "severity": "심각",
      "description": "잎과 열매에 갈색 반점이 형성되며, 즉시 방제가 필요합니다.",
      "lesionArea": {
        "x": 30.0,
        "y": 25.0,
        "w": 38.0,
        "h": 32.0
      },
      "rank": 1,
      "treatmentSteps": [
        {
          "stepOrder": 1,
          "title": "감염 부위 제거",
          "description": "감염된 잎과 열매 즉시 제거 후 소각 처리",
          "chemical": null
        },
        {
          "stepOrder": 2,
          "title": "살균제 살포",
          "description": "프로피네브 또는 만코제브 계열 살균제를 3~5일 간격으로 살포",
          "chemical": "프로피네브, 만코제브"
        }
      ],
      "source": "농촌진흥청 병해충 관리 지침"
    }
  ]
}
```

---

### 방제 상태 변경

`PATCH /diagnoses/{diagnosisId}/treatment-status`

**Request**

```json
{
  "treatmentStatus": "방제 완료"
}
```

**Response**

```json
{
  "success": true
}
```

---

### 최근 유사 사례 조회

`GET /diagnoses/{diagnosisId}/similar-cases`

**Request**

없음

> 해당 진단의 대표 질병명으로 다른 사용자의 진단 기록을 조회한다.

**Response**

```json
[
  {
    "id": 201,
    "location": "경기 여주시",
    "cropName": "고추",
    "severity": "심각",
    "weather": {
      "temperature": 28.0,
      "humidity": 85,
      "precipitation": 5.0
    },
    "diagnosedAt": "2026-05-10T14:00:00+09:00"
  }
]
```

---

## 캘린더

### 월별 캘린더 기록

`GET /calendar/diagnoses`

**Request**

Query Parameters: `year=2026&month=5` (필수)

**Response**

```json
[
  {
    "date": "2026-05-15",
    "count": 2,
    "mildCount": 0,
    "moderateCount": 1,
    "severeCount": 1,
    "treatmentRequiredCount": 1
  }
]
```

---

### 특정 날짜 기록

`GET /calendar/diagnoses/{date}`

**Request**

Path Parameter: `2026-05-15`

**Response**

```json
[
  {
    "id": 101,
    "cropName": "고추",
    "diseaseName": "탄저병",
    "severity": "심각",
    "imageUrl": "https://storage.example.com/diagnoses/101.jpg",
    "confidence": 92.5,
    "location": "경기도 이천시"
  }
]
```

---

### 월별 통계

`GET /diagnoses/stats/monthly`

**Request**

Query Parameters: `year=2026` (필수)

**Response**

```json
[
  {
    "month": 1,
    "totalCount": 3,
    "severeCount": 1,
    "treatmentCompletedCount": 2
  }
]
```

---

## 기상

### 지역별 기상 조회

`GET /weather/{city}/{district}`

**Request**

Path Parameters: `city=서울특별시`, `district=강남구`

**Response**

```json
{
  "city": "서울특별시",
  "district": "강남구",
  "temperature": 23.4,
  "humidity": 65,
  "precipitation": 0.0
}
```

---

## 챗봇

### 채팅 세션 생성

`POST /chat/sessions`

**Request**

```json
{
  "diagnosisId": "550e8400-e29b-41d4-a716-446655440000",
  "type": "diagnosis"
}
```

> `diagnosisId`: 선택 필드. 진단 연계 채팅이면 포함, 자유 채팅이면 `null`
>
> `type`: `diagnosis` (진단 연계) | `free` (자유 채팅)

**Response** `201 Created`

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "type": "diagnosis",
  "diagnosisId": "550e8400-e29b-41d4-a716-446655440000",
  "lastMessage": null,
  "createdAt": "2026-05-16T10:00:00",
  "updatedAt": null
}
```

---

### 세션 목록 조회

`GET /chat/sessions`

**Request**

없음

**Response**

```json
[
  {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "type": "diagnosis",
    "diagnosisId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "고추 탄저병 상담",
    "lastMessage": "탄저병이면 당장 약을...",
    "updatedAt": "2026-05-16T10:33:00"
  }
]
```

---

### 채팅 이력 조회

`GET /chat/sessions/{sessionId}/messages`

**Request**

없음

**Response**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "role": "ai",
    "text": "안녕하세요! 저는 농업 AI 도우미입니다...",
    "verified": true,
    "source": "농촌진흥청 병해충 관리 지침",
    "createdAt": "2026-05-16T10:32:00"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "role": "user",
    "text": "탄저병이면 당장 약을 써야 하나요?",
    "verified": null,
    "source": null,
    "createdAt": "2026-05-16T10:33:00"
  }
]
```

---

### 메시지 전송

`POST /chat/sessions/{sessionId}/messages`

**Request**

```json
{
  "message": "탄저병이면 당장 약을 써야 하나요?"
}
```

**Response** `201 Created`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "role": "ai",
  "text": "네, 탄저병은 빠른 방제가 매우 중요합니다...",
  "verified": true,
  "source": "농촌진흥청 병해충 관리 지침",
  "createdAt": "2026-05-16T10:33:00"
}
```
