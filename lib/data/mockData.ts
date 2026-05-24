export type Severity = "경미" | "보통" | "심각";

export interface DiagnosisResult {
  id: string;
  diseaseKr: string;
  diseaseEn: string;
  confidence: number;
  severity: Severity;
  description: string;
  lesionArea: { x: number; y: number; w: number; h: number };
  treatmentSteps: string[];
  source: string;
}

export interface DiagnosisRecord {
  id: string;
  date: string;
  crop: string;
  imageUrl: string;
  location: string;
  results: DiagnosisResult[];
  primaryDisease: string;
  primarySeverity: Severity;
  weather: { temp: number; humidity: number; precipitation: number };
}

export const CROP_LIST = [
  "고추",
  "토마토",
  "딸기",
  "오이",
  "감자",
  "배추",
  "상추",
  "파프리카",
  "가지",
  "수박",
];

export const DIAGNOSIS_RECORDS: DiagnosisRecord[] = [
  {
    id: "rec-001",
    date: "2026-04-28",
    crop: "고추",
    imageUrl:
      "https://images.unsplash.com/photo-1749188693224-2b48722f8d35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXIlMjBwbGFudCUyMGRpc2Vhc2UlMjBsZWFmJTIwc3BvdHN8ZW58MXx8fHwxNzc3NTMwMDMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    location: "경기도 이천시 마장면",
    primaryDisease: "탄저병",
    primarySeverity: "심각",
    weather: { temp: 22, humidity: 78, precipitation: 3 },
    results: [
      {
        id: "dis-001",
        diseaseKr: "탄저병",
        diseaseEn: "Anthracnose",
        confidence: 92,
        severity: "심각",
        description:
          "탄저병은 고추에서 가장 흔하게 발생하는 곰팡이성 병해로, 고온다습한 환경에서 급속히 확산됩니다. 열매 표면에 움푹 들어간 갈색 반점이 나타나며, 심한 경우 전체 과실이 썩게 됩니다.",
        lesionArea: { x: 30, y: 25, w: 38, h: 32 },
        treatmentSteps: [
          "감염된 잎과 열매 즉시 제거 후 소각 처리",
          "프로피네브 또는 만코제브 계열 살균제를 3~5일 간격으로 살포",
          "작물 간 통풍이 잘 되도록 환경 개선",
          "비가 온 후 24시간 내 예방 살포 실시",
        ],
        source: "농촌진흥청 병해충 관리 지침",
      },
      {
        id: "dis-002",
        diseaseKr: "노균병",
        diseaseEn: "Downy Mildew",
        confidence: 78,
        severity: "보통",
        description: "잎 뒷면에 흰 곰팡이가 발생하며, 습도 관리가 필요합니다.",
        lesionArea: { x: 55, y: 40, w: 25, h: 28 },
        treatmentSteps: [
          "포장 내 습도를 60% 이하로 유지",
          "메탈락실 계열 살균제 살포",
          "피해 잎 제거 및 소각",
        ],
        source: "농촌진흥청 병해충 관리 지침",
      },
      {
        id: "dis-003",
        diseaseKr: "세균성점무늬병",
        diseaseEn: "Bacterial Spot",
        confidence: 65,
        severity: "경미",
        description:
          "초기 단계로 작은 수침상 반점이 관찰됩니다. 경과 관찰 후 판단하세요.",
        lesionArea: { x: 15, y: 60, w: 20, h: 18 },
        treatmentSteps: ["7~10일 후 재확인", "구리 계열 살균제 예방 살포 고려"],
        source: "농촌진흥청 병해충 관리 지침",
      },
    ],
  },
  {
    id: "rec-002",
    date: "2026-04-25",
    crop: "토마토",
    imageUrl:
      "https://images.unsplash.com/photo-1606321620984-201c81c23e69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBwbGFudCUyMGluZmVjdGVkJTIwbGVhdmVzJTIwZnVuZ3VzfGVufDF8fHx8MTc3NzUzMDAzMnww&ixlib=rb-4.1.0&q=80&w=1080",
    location: "경기도 이천시 마장면",
    primaryDisease: "역병",
    primarySeverity: "보통",
    weather: { temp: 19, humidity: 85, precipitation: 12 },
    results: [
      {
        id: "dis-004",
        diseaseKr: "역병",
        diseaseEn: "Late Blight",
        confidence: 88,
        severity: "보통",
        description:
          "잎에 암갈색 수침상 병반이 관찰됩니다. 빠른 확산 주의가 필요합니다.",
        lesionArea: { x: 20, y: 30, w: 42, h: 35 },
        treatmentSteps: [
          "피해 잎 즉시 제거",
          "메탈락실+만코제브 혼합제 살포",
          "과습 방지를 위한 배수 개선",
        ],
        source: "농촌진흥청 병해충 관리 지침",
      },
    ],
  },
  {
    id: "rec-003",
    date: "2026-04-22",
    crop: "딸기",
    imageUrl:
      "https://images.unsplash.com/photo-1634627160737-77715d2f9aa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhd2JlcnJ5JTIwcGxhbnQlMjBkaXNlYXNlfGVufDF8fHx8MTc3NzUzMDAzMnww&ixlib=rb-4.1.0&q=80&w=1080",
    location: "경기도 이천시 마장면",
    primaryDisease: "흰가루병",
    primarySeverity: "경미",
    weather: { temp: 18, humidity: 70, precipitation: 0 },
    results: [
      {
        id: "dis-005",
        diseaseKr: "흰가루병",
        diseaseEn: "Powdery Mildew",
        confidence: 95,
        severity: "경미",
        description:
          "잎 표면에 흰 가루 모양의 균사가 발생했습니다. 초기 방제로 확산을 막으세요.",
        lesionArea: { x: 35, y: 20, w: 30, h: 28 },
        treatmentSteps: [
          "황 계열 살균제 살포",
          "통풍 개선으로 습도 낮추기",
          "5일 후 재확인",
        ],
        source: "농촌진흥청 병해충 관리 지침",
      },
    ],
  },
  {
    id: "rec-004",
    date: "2026-04-20",
    crop: "오이",
    imageUrl:
      "https://images.unsplash.com/photo-1659817671412-1ed518dc2dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWN1bWJlciUyMHBsYW50JTIwZ2FyZGVuJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3NzUzMDAzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    location: "경기도 이천시 마장면",
    primaryDisease: "덩굴쪼김병",
    primarySeverity: "심각",
    weather: { temp: 21, humidity: 72, precipitation: 0 },
    results: [
      {
        id: "dis-006",
        diseaseKr: "덩굴쪼김병",
        diseaseEn: "Fusarium Wilt",
        confidence: 84,
        severity: "심각",
        description:
          "줄기 아래 부분이 쪼개지며 급격히 시들어갑니다. 피해 포기 즉시 제거 필요.",
        lesionArea: { x: 40, y: 50, w: 25, h: 40 },
        treatmentSteps: [
          "피해 포기 즉시 뽑아 소각",
          "토양 훈증 소독 실시",
          "다음 재배 시 저항성 품종 사용",
          "연작 피해 방지를 위한 윤작 실시",
        ],
        source: "농촌진흥청 병해충 관리 지침",
      },
    ],
  },
  {
    id: "rec-005",
    date: "2026-04-15",
    crop: "고추",
    imageUrl:
      "https://images.unsplash.com/photo-1749188693224-2b48722f8d35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXIlMjBwbGFudCUyMGRpc2Vhc2UlMjBsZWFmJTIwc3BvdHN8ZW58MXx8fHwxNzc3NTMwMDMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    location: "경기도 이천시 마장면",
    primaryDisease: "탄저병",
    primarySeverity: "보통",
    weather: { temp: 20, humidity: 68, precipitation: 0 },
    results: [
      {
        id: "dis-007",
        diseaseKr: "탄저병",
        diseaseEn: "Anthracnose",
        confidence: 79,
        severity: "보통",
        description:
          "잎에 갈색 반점이 발생했습니다. 주의 깊게 관찰하며 방제를 준비하세요.",
        lesionArea: { x: 25, y: 30, w: 35, h: 30 },
        treatmentSteps: ["피해 잎 제거", "예방 살균제 살포", "3일 후 재확인"],
        source: "농촌진흥청 병해충 관리 지침",
      },
    ],
  },
];

export const CHAT_HISTORY_MOCK = [
  {
    id: "msg-001",
    role: "ai" as const,
    text: "안녕하세요! 저는 농업 AI 도우미입니다. 고추 탄저병이 진단되었습니다. 궁금한 점을 질문해 주세요.",
    verified: true,
    timestamp: "10:32",
  },
  {
    id: "msg-002",
    role: "user" as const,
    text: "탄저병이면 당장 약을 써야 하나요?",
    timestamp: "10:33",
  },
  {
    id: "msg-003",
    role: "ai" as const,
    text: "네, 탄저병은 빠른 방제가 매우 중요합니다. 프로피네브 또는 만코제브 계열 살균제를 3~5일 간격으로 살포하세요. 이미 감염된 잎과 열매는 즉시 제거하고 소각 처리해 주십시오.",
    verified: true,
    source: "농촌진흥청 병해충 관리 지침",
    timestamp: "10:33",
  },
];

export const QUICK_QUESTIONS = [
  "지금 약을 써야 하나요?",
  "물을 줄여야 하나요?",
  "며칠 후 다시 확인하면 되나요?",
  "이웃 작물에도 퍼질 수 있나요?",
];

export const getSeverityColor = (severity: Severity) => {
  switch (severity) {
    case "경미":
      return { bg: "#E8F5E9", text: "#2E7D32", dot: "#4CAF50" };
    case "보통":
      return { bg: "#FFF8E1", text: "#F57F17", dot: "#FFC107" };
    case "심각":
      return { bg: "#FFEBEE", text: "#C62828", dot: "#F44336" };
  }
};

export const AI_RESPONSES: Record<string, string> = {
  "지금 약을 써야 하나요?":
    "네, 탄저병은 즉시 방제가 중요합니다. 프로피네브 또는 만코제브 계열 살균제를 3~5일 간격으로 살포하세요. 이미 감염된 부위는 제거 후 소각 처리하십시오.",
  "물을 줄여야 하나요?":
    "탄저병은 과습 환경에서 빠르게 번집니다. 관수량을 20~30% 줄이고, 아침에 물을 주어 저녁 전에 건조될 수 있도록 해주세요. 토양 배수 상태도 확인이 필요합니다.",
  "며칠 후 다시 확인하면 되나요?":
    "약제 살포 후 3~5일 후에 재확인하시기 바랍니다. 증상이 악화되면 즉시 전문가 상담을 받으세요. 앱에서 알림을 설정해 드릴 수 있습니다.",
  "이웃 작물에도 퍼질 수 있나요?":
    "네, 탄저병 포자는 빗물과 바람으로 퍼질 수 있습니다. 이웃 작물에도 예방 차원의 살균제 살포를 권장하며, 작업 도구 소독도 중요합니다.",
};
