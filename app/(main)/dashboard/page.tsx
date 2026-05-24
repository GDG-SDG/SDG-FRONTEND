"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Filter,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  ChevronDown,
  X,
} from "lucide-react";
import {
  DIAGNOSIS_RECORDS,
  DiagnosisRecord,
  getSeverityColor,
  Severity,
} from "@/lib/data/mockData";

type FilterSeverity = "전체" | "심각" | "보통" | "경미";
type FilterCrop = "전체" | "고추" | "토마토" | "딸기" | "오이";

function SeverityBadge({ severity }: { severity: Severity }) {
  const colors = getSeverityColor(severity);
  return (
    <span
      className="px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize: "11px",
        fontWeight: 700,
      }}
    >
      {severity}
    </span>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1.5 rounded-full"
        style={{ backgroundColor: "#F0F0F0" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            backgroundColor:
              value >= 85 ? "#F44336" : value >= 70 ? "#FFC107" : "#4CAF50",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#333",
          minWidth: "32px",
          textAlign: "right",
        }}
      >
        {value}%
      </span>
    </div>
  );
}

function DiagnosisCard({
  record,
  selected,
  onSelect,
}: {
  record: DiagnosisRecord;
  selected: boolean;
  onSelect: () => void;
}) {
  const topResult = record.results[0];
  const colors = getSeverityColor(record.primarySeverity);
  const dateFormatted = new Date(record.date).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm"
      style={{
        backgroundColor: "white",
        border: `1.5px solid ${selected ? "#2D7A3E" : "#F0F0F0"}`,
      }}
    >
      <button className="w-full text-left" onClick={onSelect}>
        <div className="flex gap-3 p-4">
          <div
            className="relative flex-shrink-0"
            style={{ width: "80px", height: "80px" }}
          >
            <img
              src={record.imageUrl}
              alt={record.crop}
              className="w-full h-full object-cover rounded-xl"
            />
            <div
              className="absolute"
              style={{
                left: `${topResult.lesionArea.x * 0.8}%`,
                top: `${topResult.lesionArea.y * 0.8}%`,
                width: `${topResult.lesionArea.w}%`,
                height: `${topResult.lesionArea.h}%`,
                border: `2px solid ${colors.dot}`,
                borderRadius: "3px",
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: "11px", color: "#9E9E9E" }}>
                {dateFormatted}
              </span>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "#E8F5E9",
                  color: "#2D7A3E",
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                {record.crop}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                style={{ fontSize: "17px", fontWeight: 800, color: "#1a1a1a" }}
              >
                {topResult.diseaseKr}
              </span>
              <SeverityBadge severity={record.primarySeverity} />
            </div>
            <ConfidenceBar value={topResult.confidence} />
            <p
              className="mt-1.5 overflow-hidden"
              style={{
                fontSize: "12px",
                color: "#757575",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
              }}
            >
              {topResult.description}
            </p>
          </div>
          <ChevronRight
            size={16}
            style={{ color: "#BDBDBD", flexShrink: 0, alignSelf: "center" }}
          />
        </div>
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>("전체");
  const [filterCrop, setFilterCrop] = useState<FilterCrop>("전체");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);
  const [showCropDropdown, setShowCropDropdown] = useState(false);

  const filtered = DIAGNOSIS_RECORDS.filter((r) => {
    const sev =
      filterSeverity === "전체" || r.primarySeverity === filterSeverity;
    const crop = filterCrop === "전체" || r.crop === filterCrop;
    return sev && crop;
  });

  return (
    <div
      className="flex flex-col h-full overflow-y-auto relative"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      {/* Header */}
      <div
        className="px-5 pt-4 pb-3 flex-shrink-0 sticky top-0 z-20"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a" }}>
            기록
          </h1>
          <button
            onClick={() => router.push("/calendar")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{
              backgroundColor: "#E8F5E9",
              fontSize: "12px",
              fontWeight: 600,
              color: "#2D7A3E",
            }}
          >
            <Calendar size={14} />
            캘린더
          </button>
        </div>

        <div className="flex gap-2 relative">
          <div className="flex items-center gap-1 flex-shrink-0">
            <Filter size={12} style={{ color: "#9E9E9E" }} />
          </div>

          {/* Severity filter */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowSeverityDropdown(!showSeverityDropdown);
                setShowCropDropdown(false);
              }}
              className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: "white",
                color: "#616161",
                border: "1.5px solid #E0E0E0",
              }}
            >
              <span>심각도: {filterSeverity}</span>
              <ChevronDown size={14} />
            </button>
            {showSeverityDropdown && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-xl overflow-hidden z-10"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E0E0E0",
                }}
              >
                {(["전체", "심각", "보통", "경미"] as FilterSeverity[]).map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setFilterSeverity(s);
                        setShowSeverityDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-green-50 transition-colors"
                      style={{
                        fontSize: "12px",
                        fontWeight: filterSeverity === s ? 700 : 400,
                        color: filterSeverity === s ? "#2D7A3E" : "#616161",
                        borderBottom: "1px solid #F5F5F5",
                      }}
                    >
                      {s}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Crop filter */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowCropDropdown(!showCropDropdown);
                setShowSeverityDropdown(false);
              }}
              className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: "white",
                color: "#616161",
                border: "1.5px solid #E0E0E0",
              }}
            >
              <span>작물: {filterCrop}</span>
              <ChevronDown size={14} />
            </button>
            {showCropDropdown && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-xl overflow-hidden z-10"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E0E0E0",
                }}
              >
                {(
                  ["전체", "고추", "토마토", "딸기", "오이"] as FilterCrop[]
                ).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setFilterCrop(c);
                      setShowCropDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-orange-50 transition-colors"
                    style={{
                      fontSize: "12px",
                      fontWeight: filterCrop === c ? 700 : 400,
                      color: filterCrop === c ? "#FF6B35" : "#616161",
                      borderBottom: "1px solid #F5F5F5",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="px-5 pb-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Info
              size={40}
              style={{ color: "#BDBDBD", marginBottom: "12px" }}
            />
            <p style={{ fontSize: "15px", color: "#9E9E9E", fontWeight: 500 }}>
              해당 조건의 진단 기록이 없습니다
            </p>
          </div>
        ) : (
          filtered.map((record) => (
            <DiagnosisCard
              key={record.id}
              record={record}
              selected={selectedId === record.id}
              onSelect={() =>
                setSelectedId(selectedId === record.id ? null : record.id)
              }
            />
          ))
        )}
      </div>

      {/* Detail modal */}
      {selectedId &&
        (() => {
          const record = DIAGNOSIS_RECORDS.find((r) => r.id === selectedId);
          if (!record) return null;
          const topResult = record.results[0];
          const colors = getSeverityColor(record.primarySeverity);

          return (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              onClick={() => setSelectedId(null)}
            >
              <div
                className="w-full rounded-2xl overflow-hidden shadow-xl flex flex-col"
                style={{
                  backgroundColor: "white",
                  maxHeight: "75vh",
                  maxWidth: "350px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
                  style={{ backgroundColor: colors.bg }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: colors.dot }}
                  >
                    <AlertTriangle size={14} style={{ color: "white" }} />
                  </div>
                  <div className="flex-1">
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: colors.text,
                      }}
                    >
                      {topResult.diseaseKr} - {record.primarySeverity}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: colors.text,
                        opacity: 0.8,
                      }}
                    >
                      신뢰도 {topResult.confidence}% · {record.crop} ·{" "}
                      {record.location}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                  >
                    <X size={16} style={{ color: colors.text }} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: "1px solid #F5F5F5" }}
                  >
                    <h4
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#2D7A3E",
                        marginBottom: "6px",
                      }}
                    >
                      🔬 병해 설명
                    </h4>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#333",
                        lineHeight: 1.6,
                      }}
                    >
                      {topResult.description}
                    </p>
                  </div>

                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: "1px solid #F5F5F5" }}
                  >
                    <h4
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#FF6B35",
                        marginBottom: "6px",
                      }}
                    >
                      📊 최근 유사 사례
                    </h4>
                    <div className="space-y-2">
                      {[
                        {
                          region: "경기 여주시",
                          env: "비닐하우스, 습도 85%, 온도 28°C",
                          severity: "#F44336",
                        },
                        {
                          region: "충남 천안시",
                          env: "노지 재배, 장마 기간, 습도 90%",
                          severity: "#F44336",
                        },
                        {
                          region: "경기 용인시",
                          env: "시설재배, 통풍 불량, 밀식 환경",
                          severity: "#FFC107",
                        },
                        {
                          region: "강원 홍천군",
                          env: "노지 재배, 습도 75%, 조기 예방 살포",
                          severity: "#4CAF50",
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div
                            className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: item.severity }}
                          />
                          <p
                            style={{
                              fontSize: "11px",
                              color: "#616161",
                              lineHeight: 1.5,
                            }}
                          >
                            <strong style={{ color: "#333" }}>
                              {item.region}
                            </strong>{" "}
                            · {item.env}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-4 py-3 pb-4">
                    <h4
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#2D7A3E",
                        marginBottom: "6px",
                      }}
                    >
                      💊 회복 및 방제 방법
                    </h4>
                    <div className="space-y-2">
                      {topResult.treatmentSteps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{
                              backgroundColor: "#2D7A3E",
                              fontSize: "9px",
                              fontWeight: 700,
                              color: "white",
                            }}
                          >
                            {i + 1}
                          </div>
                          <p
                            style={{
                              fontSize: "11px",
                              color: "#333",
                              lineHeight: 1.6,
                            }}
                          >
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div
                      className="mt-3 px-3 py-2 rounded-lg flex items-center gap-2"
                      style={{ backgroundColor: "#F5F5F5" }}
                    >
                      <CheckCircle size={12} style={{ color: "#2D7A3E" }} />
                      <p style={{ fontSize: "11px", color: "#757575" }}>
                        출처: {topResult.source}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="px-4 py-3 flex-shrink-0"
                  style={{
                    backgroundColor: "#FAFAFA",
                    borderTop: "1px solid #F0F0F0",
                  }}
                >
                  <button
                    onClick={() => router.push("/chat")}
                    className="w-full py-3 rounded-xl"
                    style={{
                      backgroundColor: "#2D7A3E",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    AI 상담 시작하기
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
