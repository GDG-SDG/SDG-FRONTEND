"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Filter,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  ChevronDown,
  X,
} from "lucide-react";
import { getSeverityColor } from "@/lib/data/mockData";
import { DiagnosisCard } from "@/components/dashboard/DiagnosisCard";
import {
  useDiagnoses,
  useDiagnosisDetail,
  useSimilarCases,
  useUpdateTreatmentStatus,
} from "@/lib/queries/useDiagnoses";

type FilterSeverity = "전체" | "심각" | "보통" | "경미";
type FilterCrop = "전체" | "고추" | "토마토" | "딸기" | "오이";

export default function DashboardPage() {
  const router = useRouter();
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>("전체");
  const [filterCrop, setFilterCrop] = useState<FilterCrop>("전체");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);
  const [showCropDropdown, setShowCropDropdown] = useState(false);

  const { data, isLoading, isError } = useDiagnoses();
  const { data: detail } = useDiagnosisDetail(selectedId);
  const { data: similarCases } = useSimilarCases(selectedId);
  const updateStatus = useUpdateTreatmentStatus();

  const filtered = (data?.content ?? []).filter((r) => {
    const sev = filterSeverity === "전체" || r.severity === filterSeverity;
    const crop = filterCrop === "전체" || r.cropName === filterCrop;
    return sev && crop;
  });

  return (
    <div className="flex flex-col h-full relative">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="glass-bar-top px-5 pt-4 pb-3 flex-shrink-0 sticky top-0 z-20">
          <div className="flex items-center justify-between mb-3">
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "rgb(var(--glass-text) / 0.95)",
              }}
            >
              기록
            </h1>
            <button
              onClick={() => router.push("/calendar")}
              className="glass-pill flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{
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
              <Filter
                size={12}
                style={{ color: "rgb(var(--glass-text) / 0.55)" }}
              />
            </div>

            {/* Severity filter */}
            <div className="relative flex-1">
              <button
                onClick={() => {
                  setShowSeverityDropdown(!showSeverityDropdown);
                  setShowCropDropdown(false);
                }}
                className="glass-pill w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "rgb(var(--glass-text) / 0.85)",
                }}
              >
                <span>심각도: {filterSeverity}</span>
                <ChevronDown size={14} />
              </button>
              {showSeverityDropdown && (
                <div className="glass-card-strong absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-10">
                  {(["전체", "심각", "보통", "경미"] as FilterSeverity[]).map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setFilterSeverity(s);
                          setShowSeverityDropdown(false);
                        }}
                        className="glass-row w-full px-3 py-2 text-left"
                        style={{
                          fontSize: "12px",
                          fontWeight: filterSeverity === s ? 700 : 400,
                          color:
                            filterSeverity === s
                              ? "#2D7A3E"
                              : "rgb(var(--glass-text) / 0.7)",
                          borderBottom:
                            "1px solid rgb(var(--glass-accent) / 0.1)",
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
                className="glass-pill w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "rgb(var(--glass-text) / 0.85)",
                }}
              >
                <span>작물: {filterCrop}</span>
                <ChevronDown size={14} />
              </button>
              {showCropDropdown && (
                <div className="glass-card-strong absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-10">
                  {(
                    ["전체", "고추", "토마토", "딸기", "오이"] as FilterCrop[]
                  ).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setFilterCrop(c);
                        setShowCropDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left transition-colors"
                      style={{
                        fontSize: "12px",
                        fontWeight: filterCrop === c ? 700 : 400,
                        color:
                          filterCrop === c
                            ? "#FF6B35"
                            : "rgb(var(--glass-text) / 0.7)",
                        borderBottom:
                          "1px solid rgb(var(--glass-accent) / 0.1)",
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p
                style={{ fontSize: "15px", color: "#9E9E9E", fontWeight: 500 }}
              >
                진단 기록을 불러오는 중...
              </p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Info
                size={40}
                style={{ color: "#F44336", marginBottom: "12px" }}
              />
              <p
                style={{ fontSize: "15px", color: "#9E9E9E", fontWeight: 500 }}
              >
                기록을 불러오지 못했습니다
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Info
                size={40}
                style={{ color: "#BDBDBD", marginBottom: "12px" }}
              />
              <p
                style={{ fontSize: "15px", color: "#9E9E9E", fontWeight: 500 }}
              >
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
      </div>

      {/* Detail modal */}
      {selectedId !== null &&
        detail &&
        (() => {
          const topResult = detail.results[0];
          const colors = getSeverityColor(detail.severity);

          return (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              onClick={() => setSelectedId(null)}
            >
              <div
                className="glass-card-strong w-full rounded-2xl overflow-hidden flex flex-col"
                style={{
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
                      {topResult.diseaseNameKr} - {detail.severity}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: colors.text,
                        opacity: 0.8,
                      }}
                    >
                      신뢰도 {topResult.confidence}% · {detail.cropName} ·{" "}
                      {detail.location}
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
                      {(similarCases ?? []).length === 0 ? (
                        <p style={{ fontSize: "11px", color: "#9E9E9E" }}>
                          유사 사례가 없습니다
                        </p>
                      ) : (
                        (similarCases ?? []).map((item) => (
                          <div key={item.id} className="flex items-start gap-2">
                            <div
                              className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                              style={{
                                backgroundColor: getSeverityColor(item.severity)
                                  .dot,
                              }}
                            />
                            <p
                              style={{
                                fontSize: "11px",
                                color: "#616161",
                                lineHeight: 1.5,
                              }}
                            >
                              <strong style={{ color: "#333" }}>
                                {item.location}
                              </strong>{" "}
                              · {item.cropName} · 습도 {item.weather.humidity}%
                              · 온도 {item.weather.temperature}°C
                            </p>
                          </div>
                        ))
                      )}
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
                      {topResult.treatmentSteps.map((step) => (
                        <div
                          key={step.stepOrder}
                          className="flex items-start gap-2"
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{
                              backgroundColor: "#2D7A3E",
                              fontSize: "9px",
                              fontWeight: 700,
                              color: "white",
                            }}
                          >
                            {step.stepOrder}
                          </div>
                          <div className="flex-1">
                            <p
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: "#1a1a1a",
                                lineHeight: 1.6,
                              }}
                            >
                              {step.title}
                            </p>
                            <p
                              style={{
                                fontSize: "11px",
                                color: "#333",
                                lineHeight: 1.6,
                              }}
                            >
                              {step.description}
                            </p>
                            {step.chemical && (
                              <p
                                style={{
                                  fontSize: "10px",
                                  color: "#FF6B35",
                                  marginTop: "2px",
                                }}
                              >
                                💊 {step.chemical}
                              </p>
                            )}
                          </div>
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
                  className="px-4 py-3 flex-shrink-0 flex flex-col gap-2"
                  style={{
                    backgroundColor: "#FAFAFA",
                    borderTop: "1px solid #F0F0F0",
                  }}
                >
                  {(() => {
                    const isDone = detail.treatmentStatus === "방제 완료";
                    return (
                      <button
                        onClick={() =>
                          updateStatus.mutate({
                            id: detail.id,
                            treatmentStatus: isDone ? "방제 필요" : "방제 완료",
                          })
                        }
                        disabled={updateStatus.isPending}
                        className="w-full py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                        style={{
                          backgroundColor: isDone ? "#E8F5E9" : "white",
                          color: "#2D7A3E",
                          border: "1.5px solid #2D7A3E",
                          fontSize: "14px",
                          fontWeight: 700,
                          opacity: updateStatus.isPending ? 0.6 : 1,
                        }}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle size={16} /> 방제 완료됨
                          </>
                        ) : (
                          "방제 완료로 표시"
                        )}
                      </button>
                    );
                  })()}
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
