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
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Radix-000000?style=flat-square&logo=shadcnui&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white)

<br/>

</div>

---

## 📌 프로젝트 개요

**AgriGuard**는 농산물을 재배하는 개인 농업인을 위한 AI 기반 작물 병해충 진단 웹앱이다.

> 카메라로 작물 촬영 → 온디바이스(TFLite) 1차 진단 → 서버(YOLOv8) 정밀 진단 → Gemini RAG 챗봇 방제 상담

스마트팜 설비 없이 스마트폰 하나로 정밀 농업 의사결정을 지원한다.

---

## 🏗️ 아키텍처 개요

```
┌─────────────────────────────────────────────────┐
│                AgriGuard Web (Next.js 14)         │
│                                                  │
│  ┌─────────────┐  ┌───────────────┐  ┌────────┐ │
│  │  Camera /   │  │  TanStack     │  │Zustand │ │
│  │  PWA 촬영   │  │  Query        │  │전역상태│ │
│  │  (MediaAPI) │  │  (서버 캐싱)  │  │        │ │
│  └──────┬──────┘  └───────┬───────┘  └────────┘ │
│         └─────────────────┼──────────────────────┤
│                    Axios + JWT 인터셉터           │
└──────────────────────────┬──────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       Spring Boot API           FastAPI (AI 서버)
       (메인 백엔드)              (YOLOv8 · SAM2 · DINOv2)
```

---

## ⚙️ 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS 3.x |
| UI Components | shadcn/ui (Radix UI 기반) |
| 서버 상태 | TanStack Query v5 |
| 전역 상태 | Zustand |
| 폼 관리 | React Hook Form + Zod |
| 애니메이션 | Framer Motion |
| HTTP | Axios |
| 차트 | Recharts |
| 카메라 | MediaDevices API |
| PWA | next-pwa |
| Linter | Biome |
| 배포 | Vercel (Preview / Production 분리) |

---

## 🗂️ 프로젝트 구조

```
agriguard-web/
├── app/
│   ├── (auth)/login · signup
│   ├── (main)/
│   │   ├── dashboard/
│   │   ├── diagnose/ · diagnose/[id]/
│   │   ├── chat/
│   │   ├── calendar/
│   │   └── products/
│   └── api/upload/route.ts       # 이미지 업로드 BFF
│
├── components/
│   ├── ui/                       # shadcn/ui
│   ├── camera/ · diagnose/ · dashboard/
│   ├── chat/ · calendar/
│   └── common/                   # BottomNav, ErrorBoundary 등
│
├── lib/
│   ├── api/                      # Axios 인스턴스 + API 함수
│   ├── queries/                  # TanStack Query 훅
│   ├── store/                    # Zustand 스토어
│   └── hooks/                    # useCamera, useGeolocation
│
├── types/
├── public/manifest.json          # PWA 매니페스트
└── vercel.json
```

---

## 🚀 시작하기

### 요구사항

- Node.js 20+
- pnpm 9+

### 설치 및 실행

```bash
git clone https://github.com/your-org/agriguard-web.git
cd agriguard-web

pnpm install

cp .env.example .env.local
# .env.local 환경변수 입력 후 실행

pnpm dev
```

### 환경변수

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_APP_ENV=development
```

---

## 🌐 배포

Vercel을 통해 **Preview / Production 환경을 분리**하여 배포한다.

| 브랜치 | 환경 | URL |
|--------|------|-----|
| `main` | Production | `agriguard.vercel.app` |
| `dev` | Preview (고정) | `dev.agriguard.vercel.app` |
| `feat/*` | Preview (임시) | PR 생성 시 자동 발급 |

---

## 📡 주요 API 연동

| Method | Endpoint | 설명 |
|--------|----------|------|
| `POST` | `/api/v1/auth/signup` | 회원가입 |
| `POST` | `/api/v1/auth/login` | 로그인 |
| `POST` | `/api/v1/diagnose` | 이미지 업로드 및 진단 요청 |
| `GET` | `/api/v1/diagnose/{id}` | 진단 결과 조회 (폴링) |
| `GET` | `/api/v1/diagnose/history` | 진단 이력 목록 |
| `GET` | `/api/v1/risk/current` | 현재 위험도 조회 |
| `GET` | `/api/v1/dashboard` | 대시보드 데이터 |
| `POST` | `/api/v1/chat` | AI 챗봇 메시지 전송 |
| `GET` | `/api/v1/treatment/history` | 방제 이력 조회 |

---

## 🧭 개발 일정

| Phase | 기간 | 내용 |
|-------|------|------|
| Phase 1 | 3/27 ~ 4/3 | 환경 구성, 디자인 시스템, 인증 |
| Phase 2 | 4/4 ~ 4/24 | P0 — 카메라·진단·챗봇·대시보드 |
| Phase 3 | 4/25 ~ 5/15 | P1 — 캘린더·차트·약제·PWA |
| Phase 4 | 5/16 ~ | QA, 성능 최적화, 크로스 브라우저 |

---

## 🤝 컨벤션

### 브랜치

```
main      배포 브랜치 (보호)
├── dev   개발 통합 브랜치
│   └── feat/xxx
└── hotfix/xxx
```

### 커밋 메시지

```
feat: 카메라 캡처 컴포넌트 구현
fix: 진단 결과 폴링 중복 요청 제거
chore: TanStack Query 설정 추가
style: DiagnoseCard 레이아웃 조정
```

---

## 👥 팀원

| 역할 | 이름 | 담당 |
|------|------|------|
| Frontend | **기훈** | 카메라·진단 플로우, 대시보드, PWA, 배포 |

---

<div align="center">

<br/>

**SDG PROJECT · 2025**

*스마트팜 없이도, 스마트하게 농사짓다*

</div>
