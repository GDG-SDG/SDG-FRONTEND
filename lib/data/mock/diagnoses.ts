// API 응답 형태(api-spec.md)에 맞춘 진단 mock — USE_MOCK=true 구간에서 사용
import type {
  DiagnosisDetail,
  DiagnosisListItem,
  MonthlyStat,
  SimilarCase,
} from "@/lib/types/diagnosis";

const PEPPER_IMG =
  "https://images.unsplash.com/photo-1749188693224-2b48722f8d35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXIlMjBwbGFudCUyMGRpc2Vhc2UlMjBsZWFmJTIwc3BvdHN8ZW58MXx8fHwxNzc3NTMwMDMyfDA&ixlib=rb-4.1.0&q=80&w=1080";
const TOMATO_IMG =
  "https://images.unsplash.com/photo-1606321620984-201c81c23e69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBwbGFudCUyMGluZmVjdGVkJTIwbGVhdmVzJTIwZnVuZ3VzfGVufDF8fHx8MTc3NzUzMDAzMnww&ixlib=rb-4.1.0&q=80&w=1080";
const STRAWBERRY_IMG =
  "https://images.unsplash.com/photo-1634627160737-77715d2f9aa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhd2JlcnJ5JTIwcGxhbnQlMjBkaXNlYXNlfGVufDF8fHx8MTc3NzUzMDAzMnww&ixlib=rb-4.1.0&q=80&w=1080";
const CUCUMBER_IMG =
  "https://images.unsplash.com/photo-1659817671412-1ed518dc2dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWN1bWJlciUyMHBsYW50JTIwZ2FyZGVuJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3NzUzMDAzNnww&ixlib=rb-4.1.0&q=80&w=1080";

const LOCATION = "경기도 이천시 마장면";

/** GET /diagnoses content[] */
export const MOCK_DIAGNOSIS_LIST: DiagnosisListItem[] = [
  {
    id: 101,
    cropName: "고추",
    imageUrl: PEPPER_IMG,
    diseaseName: "탄저병",
    confidence: 92,
    severity: "심각",
    treatmentStatus: "방제 필요",
    diagnosedAt: "2026-04-28T10:30:00+09:00",
    weather: { temperature: 22, humidity: 78, precipitation: 3 },
    description:
      "탄저병은 고추에서 가장 흔하게 발생하는 곰팡이성 병해로, 고온다습한 환경에서 급속히 확산됩니다. 열매 표면에 움푹 들어간 갈색 반점이 나타나며, 심한 경우 전체 과실이 썩게 됩니다.",
    lesionArea: { x: 30, y: 25, w: 38, h: 32 },
  },
  {
    id: 102,
    cropName: "토마토",
    imageUrl: TOMATO_IMG,
    diseaseName: "역병",
    confidence: 88,
    severity: "보통",
    treatmentStatus: "방제 필요",
    diagnosedAt: "2026-04-25T09:10:00+09:00",
    weather: { temperature: 19, humidity: 85, precipitation: 12 },
    description:
      "잎에 암갈색 수침상 병반이 관찰됩니다. 빠른 확산 주의가 필요합니다.",
    lesionArea: { x: 20, y: 30, w: 42, h: 35 },
  },
  {
    id: 103,
    cropName: "딸기",
    imageUrl: STRAWBERRY_IMG,
    diseaseName: "흰가루병",
    confidence: 95,
    severity: "경미",
    treatmentStatus: "방제 완료",
    diagnosedAt: "2026-04-22T15:40:00+09:00",
    weather: { temperature: 18, humidity: 70, precipitation: 0 },
    description:
      "잎 표면에 흰 가루 모양의 균사가 발생했습니다. 초기 방제로 확산을 막으세요.",
    lesionArea: { x: 35, y: 20, w: 30, h: 28 },
  },
  {
    id: 104,
    cropName: "오이",
    imageUrl: CUCUMBER_IMG,
    diseaseName: "덩굴쪼김병",
    confidence: 84,
    severity: "심각",
    treatmentStatus: "방제 필요",
    diagnosedAt: "2026-04-20T11:00:00+09:00",
    weather: { temperature: 21, humidity: 72, precipitation: 0 },
    description:
      "줄기 아래 부분이 쪼개지며 급격히 시들어갑니다. 피해 포기 즉시 제거 필요.",
    lesionArea: { x: 40, y: 50, w: 25, h: 40 },
  },
  {
    id: 105,
    cropName: "고추",
    imageUrl: PEPPER_IMG,
    diseaseName: "탄저병",
    confidence: 79,
    severity: "보통",
    treatmentStatus: "방제 완료",
    diagnosedAt: "2026-04-15T14:20:00+09:00",
    weather: { temperature: 20, humidity: 68, precipitation: 0 },
    description:
      "잎에 갈색 반점이 발생했습니다. 주의 깊게 관찰하며 방제를 준비하세요.",
    lesionArea: { x: 25, y: 30, w: 35, h: 30 },
  },
];

/** GET /diagnoses/{id} — id로 조회 */
export const MOCK_DIAGNOSIS_DETAILS: Record<number, DiagnosisDetail> = {
  101: {
    id: 101,
    cropName: "고추",
    imageUrl: PEPPER_IMG,
    location: LOCATION,
    severity: "심각",
    treatmentStatus: "방제 필요",
    diagnosedAt: "2026-04-28T10:30:00+09:00",
    weather: { temperature: 22, humidity: 78, precipitation: 3 },
    results: [
      {
        id: 1,
        diseaseName: "Anthracnose",
        diseaseNameKr: "탄저병",
        confidence: 92,
        severity: "심각",
        description:
          "탄저병은 고추에서 가장 흔하게 발생하는 곰팡이성 병해로, 고온다습한 환경에서 급속히 확산됩니다. 열매 표면에 움푹 들어간 갈색 반점이 나타나며, 심한 경우 전체 과실이 썩게 됩니다.",
        lesionArea: { x: 30, y: 25, w: 38, h: 32 },
        rank: 1,
        treatmentSteps: [
          {
            stepOrder: 1,
            title: "감염 부위 제거",
            description: "감염된 잎과 열매 즉시 제거 후 소각 처리",
            chemical: null,
          },
          {
            stepOrder: 2,
            title: "살균제 살포",
            description: "3~5일 간격으로 계열 살균제 살포",
            chemical: "프로피네브, 만코제브",
          },
          {
            stepOrder: 3,
            title: "환경 개선",
            description: "작물 간 통풍이 잘 되도록 환경 개선",
            chemical: null,
          },
          {
            stepOrder: 4,
            title: "예방 살포",
            description: "비가 온 후 24시간 내 예방 살포 실시",
            chemical: null,
          },
        ],
        source: "농촌진흥청 병해충 관리 지침",
      },
      {
        id: 2,
        diseaseName: "Downy Mildew",
        diseaseNameKr: "노균병",
        confidence: 78,
        severity: "보통",
        description: "잎 뒷면에 흰 곰팡이가 발생하며, 습도 관리가 필요합니다.",
        lesionArea: { x: 55, y: 40, w: 25, h: 28 },
        rank: 2,
        treatmentSteps: [
          {
            stepOrder: 1,
            title: "습도 관리",
            description: "포장 내 습도를 60% 이하로 유지",
            chemical: null,
          },
          {
            stepOrder: 2,
            title: "살균제 살포",
            description: "메탈락실 계열 살균제 살포",
            chemical: "메탈락실",
          },
        ],
        source: "농촌진흥청 병해충 관리 지침",
      },
    ],
  },
  102: {
    id: 102,
    cropName: "토마토",
    imageUrl: TOMATO_IMG,
    location: LOCATION,
    severity: "보통",
    treatmentStatus: "방제 필요",
    diagnosedAt: "2026-04-25T09:10:00+09:00",
    weather: { temperature: 19, humidity: 85, precipitation: 12 },
    results: [
      {
        id: 1,
        diseaseName: "Late Blight",
        diseaseNameKr: "역병",
        confidence: 88,
        severity: "보통",
        description:
          "잎에 암갈색 수침상 병반이 관찰됩니다. 빠른 확산 주의가 필요합니다.",
        lesionArea: { x: 20, y: 30, w: 42, h: 35 },
        rank: 1,
        treatmentSteps: [
          {
            stepOrder: 1,
            title: "피해 잎 제거",
            description: "피해 잎 즉시 제거",
            chemical: null,
          },
          {
            stepOrder: 2,
            title: "살균제 살포",
            description: "메탈락실+만코제브 혼합제 살포",
            chemical: "메탈락실, 만코제브",
          },
          {
            stepOrder: 3,
            title: "배수 개선",
            description: "과습 방지를 위한 배수 개선",
            chemical: null,
          },
        ],
        source: "농촌진흥청 병해충 관리 지침",
      },
    ],
  },
  103: {
    id: 103,
    cropName: "딸기",
    imageUrl: STRAWBERRY_IMG,
    location: LOCATION,
    severity: "경미",
    treatmentStatus: "방제 완료",
    diagnosedAt: "2026-04-22T15:40:00+09:00",
    weather: { temperature: 18, humidity: 70, precipitation: 0 },
    results: [
      {
        id: 1,
        diseaseName: "Powdery Mildew",
        diseaseNameKr: "흰가루병",
        confidence: 95,
        severity: "경미",
        description:
          "잎 표면에 흰 가루 모양의 균사가 발생했습니다. 초기 방제로 확산을 막으세요.",
        lesionArea: { x: 35, y: 20, w: 30, h: 28 },
        rank: 1,
        treatmentSteps: [
          {
            stepOrder: 1,
            title: "살균제 살포",
            description: "황 계열 살균제 살포",
            chemical: "황",
          },
          {
            stepOrder: 2,
            title: "습도 낮추기",
            description: "통풍 개선으로 습도 낮추기",
            chemical: null,
          },
          {
            stepOrder: 3,
            title: "재확인",
            description: "5일 후 재확인",
            chemical: null,
          },
        ],
        source: "농촌진흥청 병해충 관리 지침",
      },
    ],
  },
  104: {
    id: 104,
    cropName: "오이",
    imageUrl: CUCUMBER_IMG,
    location: LOCATION,
    severity: "심각",
    treatmentStatus: "방제 필요",
    diagnosedAt: "2026-04-20T11:00:00+09:00",
    weather: { temperature: 21, humidity: 72, precipitation: 0 },
    results: [
      {
        id: 1,
        diseaseName: "Fusarium Wilt",
        diseaseNameKr: "덩굴쪼김병",
        confidence: 84,
        severity: "심각",
        description:
          "줄기 아래 부분이 쪼개지며 급격히 시들어갑니다. 피해 포기 즉시 제거 필요.",
        lesionArea: { x: 40, y: 50, w: 25, h: 40 },
        rank: 1,
        treatmentSteps: [
          {
            stepOrder: 1,
            title: "피해 포기 제거",
            description: "피해 포기 즉시 뽑아 소각",
            chemical: null,
          },
          {
            stepOrder: 2,
            title: "토양 소독",
            description: "토양 훈증 소독 실시",
            chemical: null,
          },
          {
            stepOrder: 3,
            title: "저항성 품종",
            description: "다음 재배 시 저항성 품종 사용",
            chemical: null,
          },
          {
            stepOrder: 4,
            title: "윤작 실시",
            description: "연작 피해 방지를 위한 윤작 실시",
            chemical: null,
          },
        ],
        source: "농촌진흥청 병해충 관리 지침",
      },
    ],
  },
  105: {
    id: 105,
    cropName: "고추",
    imageUrl: PEPPER_IMG,
    location: LOCATION,
    severity: "보통",
    treatmentStatus: "방제 완료",
    diagnosedAt: "2026-04-15T14:20:00+09:00",
    weather: { temperature: 20, humidity: 68, precipitation: 0 },
    results: [
      {
        id: 1,
        diseaseName: "Anthracnose",
        diseaseNameKr: "탄저병",
        confidence: 79,
        severity: "보통",
        description:
          "잎에 갈색 반점이 발생했습니다. 주의 깊게 관찰하며 방제를 준비하세요.",
        lesionArea: { x: 25, y: 30, w: 35, h: 30 },
        rank: 1,
        treatmentSteps: [
          {
            stepOrder: 1,
            title: "피해 잎 제거",
            description: "피해 잎 제거",
            chemical: null,
          },
          {
            stepOrder: 2,
            title: "예방 살포",
            description: "예방 살균제 살포",
            chemical: null,
          },
          {
            stepOrder: 3,
            title: "재확인",
            description: "3일 후 재확인",
            chemical: null,
          },
        ],
        source: "농촌진흥청 병해충 관리 지침",
      },
    ],
  },
};

/** GET /diagnoses/{id}/similar-cases — 같은 병해의 다른 사용자 진단 기록 */
export const MOCK_SIMILAR_CASES: SimilarCase[] = [
  {
    id: 201,
    location: "경기 여주시",
    cropName: "고추",
    severity: "심각",
    weather: { temperature: 28, humidity: 85, precipitation: 5 },
    diagnosedAt: "2026-05-10T14:00:00+09:00",
  },
  {
    id: 202,
    location: "충남 천안시",
    cropName: "고추",
    severity: "심각",
    weather: { temperature: 25, humidity: 90, precipitation: 15 },
    diagnosedAt: "2026-05-08T09:30:00+09:00",
  },
  {
    id: 203,
    location: "경기 용인시",
    cropName: "고추",
    severity: "보통",
    weather: { temperature: 26, humidity: 80, precipitation: 0 },
    diagnosedAt: "2026-05-05T11:00:00+09:00",
  },
  {
    id: 204,
    location: "강원 홍천군",
    cropName: "고추",
    severity: "경미",
    weather: { temperature: 22, humidity: 75, precipitation: 2 },
    diagnosedAt: "2026-05-01T08:00:00+09:00",
  },
];

/** GET /diagnoses/stats/monthly — 연간 월별 통계 */
export const MOCK_MONTHLY_STATS: MonthlyStat[] = [
  {
    id: 1,
    month: 1,
    totalCount: 3,
    severeCount: 1,
    treatmentCompletedCount: 2,
  },
  {
    id: 2,
    month: 2,
    totalCount: 2,
    severeCount: 0,
    treatmentCompletedCount: 2,
  },
  {
    id: 3,
    month: 3,
    totalCount: 4,
    severeCount: 2,
    treatmentCompletedCount: 3,
  },
  {
    id: 4,
    month: 4,
    totalCount: 5,
    severeCount: 2,
    treatmentCompletedCount: 2,
  },
  {
    id: 5,
    month: 5,
    totalCount: 6,
    severeCount: 3,
    treatmentCompletedCount: 4,
  },
  {
    id: 6,
    month: 6,
    totalCount: 2,
    severeCount: 1,
    treatmentCompletedCount: 1,
  },
];
