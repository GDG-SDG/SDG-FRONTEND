<div align="center">

<br/>

```
 █████╗  ██████╗ ██████╗ ██╗ ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗
██╔══██╗██╔════╝ ██╔══██╗██║██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗
███████║██║  ███╗██████╔╝██║██║  ███╗██║   ██║███████║██████╔╝██║  ██║
██╔══██║██║   ██║██╔══██╗██║██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║
██║  ██║╚██████╔╝██║  ██║██║╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝
```

### 🌿 Low-cost AI Farm Assistant — Frontend Web App

**스마트폰 하나로 작물 질병을 진단하고, 방제 시점을 예측하는 저비용 AI 농업 플랫폼**

<br/>

![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Serwist PWA](https://img.shields.io/badge/PWA-Serwist-5A0FC8?style=flat-square&logo=pwa&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white)

<br/>

</div>

---

## 📌 프로젝트 개요

**Agriguard**는 농산물을 재배하는 개인 농업인을 위한 AI 기반 작물 병해충 진단 웹앱이다.

> 사진 촬영/업로드 → 서버 정밀 진단 → 질병/방제 정보 제공 → AI 챗봇 방제 상담

스마트팜 설비 없이 스마트폰 하나로 정밀 농업 의사결정을 지원하는 모바일 우선(PWA) 웹 애플리케이션이다.

---

## ✨ 주요 기능

- **사진 진단** — 작물 사진을 업로드하면 서버가 질병을 진단하고 신뢰도·방제 정보를 제공
- **대시보드** — 최근 진단 기록, 지역 기상, 위험도 요약
- **AI 챗봇** — 진단 결과 기반 방제 상담 (마크다운 응답 렌더링)
- **캘린더** — 월별 진단/방제 기록 및 통계
- **마이페이지** — 연간 진단 추이 차트, 내 정보·알림 설정 관리
- **인증** — 회원가입 / 로그인 / 토큰 자동 재발급(silent refresh)
- **PWA** — 홈 화면 설치, 오프라인 폴백 지원

---

## ⚙️ 기술 스택

| 분류       | 기술                                                     |
| ---------- | -------------------------------------------------------- |
| Framework  | Next.js 14 (App Router)                                  |
| Language   | TypeScript 5.x                                           |
| Styling    | Tailwind CSS 3.x + 커스텀 Liquid Glass 디자인 토큰       |
| 서버 상태  | TanStack Query v5                                        |
| HTTP       | 네이티브 `fetch` 래퍼 (의존성 0, JWT 인터셉터 자체 구현) |
| 차트       | Recharts v3                                              |
| 애니메이션 | Framer Motion                                            |
| 마크다운   | react-markdown + remark-gfm                              |
| 아이콘     | lucide-react                                             |
| PWA        | Serwist (`@serwist/next`)                                |
| API 모킹   | MSW (Mock Service Worker)                                |
| Linter     | ESLint (`eslint-config-next`)                            |
| 배포       | Vercel                                                   |

---

## 🗂️ 프로젝트 구조

```
SDG-FRONTEND/
├── app/
│   ├── (auth)/                  # 인증 라우트 그룹
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/                  # 메인 앱 라우트 그룹
│   │   ├── dashboard/
│   │   ├── diagnosis/
│   │   ├── chat/
│   │   ├── calendar/
│   │   └── mypage/
│   ├── geocode/route.ts         # 좌표 → 주소 변환 프록시
│   ├── ~offline/                # PWA 오프라인 폴백
│   ├── layout.tsx · providers.tsx
│   └── manifest.ts              # PWA 매니페스트
│
├── components/
│   ├── auth/ · dashboard/
│   ├── disease/                 # 질병 상세 모달 등
│   ├── mypage/
│   └── pwa/                     # 설치 프롬프트
│
├── lib/
│   ├── api/                     # fetch 클라이언트 + API 함수
│   ├── auth/                    # 토큰 저장/재발급
│   ├── queries/                 # TanStack Query 훅
│   ├── data/mock/               # MSW용 목 데이터
│   ├── types/                   # 도메인 타입
│   └── validation/              # 폼 검증 로직
│
├── mocks/                       # MSW 핸들러
├── public/                      # 아이콘, 매니페스트 에셋
└── api-spec.md                  # 백엔드 API 명세서
```

---

## 🚀 시작하기

### 요구사항

- Node.js 20+
- npm 10+

### 설치 및 실행

```bash
git clone <repo-url>
cd SDG-FRONTEND

npm install

# 환경변수 설정 (아래 참고)
cp .env.example .env.local

npm run dev
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행된다.

### 스크립트

| 명령                 | 설명                       |
| -------------------- | -------------------------- |
| `npm run dev`        | 개발 서버 실행             |
| `npm run build`      | 프로덕션 빌드              |
| `npm run start`      | 빌드 결과 실행             |
| `npm run lint`       | ESLint 검사                |
| `npm run type-check` | 타입 검사 (`tsc --noEmit`) |

### 환경변수

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080   # 백엔드 API 베이스 URL
NEXT_PUBLIC_USE_MOCK=true                          # true면 MSW 목 응답 사용, false면 실제 API 호출
NEXT_PUBLIC_APP_ENV=development                    # development | production
```

> `NEXT_PUBLIC_USE_MOCK`이 `false`가 아니면 MSW 목 데이터로 동작하므로, 백엔드 없이도 전체 플로우를 확인할 수 있다.

---

## 📡 주요 API 연동

백엔드 계약 전체는 [`api-spec.md`](./api-spec.md)에 정리되어 있다.

| Method | Endpoint          | 설명                        |
| ------ | ----------------- | --------------------------- |
| `POST` | `/auth/signup`    | 회원가입                    |
| `POST` | `/auth/login`     | 로그인                      |
| `POST` | `/auth/refresh`   | 토큰 재발급 (HttpOnly 쿠키) |
| `GET`  | `/users/me`       | 내 정보 조회                |
| `GET`  | `/users/me/stats` | 마이페이지 통계             |
| `POST` | `/diagnoses`      | 이미지 진단 요청            |
| `GET`  | `/diagnoses`      | 진단 기록 목록              |
| `GET`  | `/diagnoses/{id}` | 진단 상세 조회              |
| `GET`  | `/calendar`       | 월별 캘린더 기록            |
| `GET`  | `/weather`        | 지역별 기상 조회            |
| `POST` | `/chat/messages`  | 챗봇 메시지 전송            |

> 엔드포인트 경로·필드는 `api-spec.md`를 기준으로 하며, 위 표는 요약이다.

---

## 🤝 컨벤션

### 커밋 메시지

```
Feat:   새 기능
Fix:    버그 수정
Style:  UI/스타일 변경
Docs:   문서
Refactor: 리팩터링
```

이슈 번호를 함께 표기한다. 예: `Feat:#27 사진 진단 API 연동`

### 브랜치

```
main                배포 브랜치 (PR 경유, 직접 push 금지)
└── feature/<issue>-<topic>
```

---

<div align="center">

<br/>

**SDG PROJECT**

_스마트팜 없이도, 스마트하게 농사짓다_

</div>
