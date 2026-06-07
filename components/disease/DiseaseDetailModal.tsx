"use client";

import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { getSeverityColor } from "@/lib/data/mockData";
import type { DiagnosisDetail, SimilarCase } from "@/lib/types/diagnosis";

const BRAND_GREEN = "rgb(var(--brand-green))";
const ACCENT_ORANGE = "rgb(var(--accent-orange))";

interface DiseaseDetailModalProps {
  detail: DiagnosisDetail;
  similarCases?: SimilarCase[];
  onClose: () => void;
  /** 제공 시 푸터에 "방제 완료로 표시" 토글 버튼 노출 */
  onToggleTreatment?: () => void;
  isUpdatingTreatment?: boolean;
  /** 제공 시 푸터에 "AI 상담 시작하기" 버튼 노출 */
  onStartChat?: () => void;
}

/**
 * 병해 상세 모달 — dashboard / diagnosis 공통.
 * 색상은 디자인 토큰(--brand-green / --accent-orange)과 getSeverityColor 단일 소스를 사용한다.
 */
export function DiseaseDetailModal({
  detail,
  similarCases,
  onClose,
  onToggleTreatment,
  isUpdatingTreatment = false,
  onStartChat,
}: DiseaseDetailModalProps) {
  const topResult = detail.results[0];
  if (!topResult) return null;

  const colors = getSeverityColor(detail.severity);
  const showFooter = Boolean(onToggleTreatment || onStartChat);
  const isTreatmentDone = detail.treatmentStatus === "방제 완료";

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(20,40,28,0.38)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl overflow-hidden flex flex-col"
        style={{
          maxHeight: "75vh",
          maxWidth: "350px",
          background:
            "linear-gradient(168deg, rgba(255,255,255,0.97) 0%, rgba(241,250,244,0.95) 100%)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.65)",
          boxShadow:
            "0 20px 60px rgba(20,50,30,0.22), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — glass-aligned: dark title + severity pill (matches card badge) */}
        <div
          className="flex items-center gap-2.5 px-4 py-3.5 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(45,122,62,0.1)" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.dot }}
          >
            <AlertTriangle size={16} style={{ color: "white" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p
                className="truncate"
                style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a1a" }}
              >
                {topResult.diseaseNameKr}
              </p>
              <span
                className="px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  backgroundColor: colors.bg,
                  color: colors.text,
                }}
              >
                {detail.severity}
              </span>
            </div>
            <p
              className="mt-0.5 truncate"
              style={{ fontSize: "11px", color: "#757575" }}
            >
              신뢰도 {topResult.confidence}% · {detail.cropName} ·{" "}
              {detail.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(20,40,28,0.06)" }}
          >
            <X size={16} style={{ color: "#616161" }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* 병해 설명 */}
          <div
            className="px-4 py-3"
            style={{ borderBottom: "1px solid rgba(45,122,62,0.08)" }}
          >
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: BRAND_GREEN,
                marginBottom: "6px",
              }}
            >
              🔬 병해 설명
            </h4>
            <p style={{ fontSize: "12px", color: "#333", lineHeight: 1.6 }}>
              {topResult.description}
            </p>
          </div>

          {/* 최근 유사 사례 */}
          <div
            className="px-4 py-3"
            style={{ borderBottom: "1px solid rgba(45,122,62,0.08)" }}
          >
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: ACCENT_ORANGE,
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
                        backgroundColor: getSeverityColor(item.severity).dot,
                      }}
                    />
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#616161",
                        lineHeight: 1.5,
                      }}
                    >
                      <strong style={{ color: "#333" }}>{item.location}</strong>{" "}
                      · {item.cropName} · 습도 {item.weather.humidity}% · 온도{" "}
                      {item.weather.temperature}°C
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 회복 및 방제 방법 */}
          <div className="px-4 py-3 pb-4">
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: BRAND_GREEN,
                marginBottom: "6px",
              }}
            >
              💊 회복 및 방제 방법
            </h4>
            <div className="space-y-2">
              {topResult.treatmentSteps.map((step) => (
                <div key={step.stepOrder} className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: BRAND_GREEN,
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
                          color: ACCENT_ORANGE,
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
              style={{ backgroundColor: "rgba(45,122,62,0.07)" }}
            >
              <CheckCircle size={12} style={{ color: BRAND_GREEN }} />
              <p style={{ fontSize: "11px", color: "#4d6b56" }}>
                출처: {topResult.source}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="px-4 pb-4 pt-1 flex-shrink-0 flex gap-2">
            {onToggleTreatment && (
              <button
                onClick={onToggleTreatment}
                disabled={isUpdatingTreatment}
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: isTreatmentDone ? "#E8F5E9" : "white",
                  color: BRAND_GREEN,
                  border: `1.5px solid ${BRAND_GREEN}`,
                  fontSize: "13px",
                  fontWeight: 700,
                  opacity: isUpdatingTreatment ? 0.6 : 1,
                }}
              >
                {isTreatmentDone ? (
                  <>
                    <CheckCircle size={15} /> 방제 완료됨
                  </>
                ) : (
                  "방제 완료로 표시"
                )}
              </button>
            )}
            {onStartChat && (
              <button
                onClick={onStartChat}
                className="flex-1 py-3 rounded-xl whitespace-nowrap"
                style={{
                  backgroundColor: BRAND_GREEN,
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                AI 상담 시작하기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
