"use client";

import { useEffect, useRef } from "react";
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

  const colors = getSeverityColor(detail.severity);
  const showFooter = Boolean(onToggleTreatment || onStartChat);
  const isTreatmentDone = detail.treatmentStatus === "방제 완료";

  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // a11y: 마운트 시 포커스 이동, Esc 닫기, Tab 포커스 트랩, 언마운트 시 포커스 복원
  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialog?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key === "Tab" && dialog) {
        const focusables = dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  // 진단 결과가 비어 있으면 렌더하지 않음 (hook 호출 이후로 내려 Rules of Hooks 준수)
  if (!topResult) return null;

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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${topResult.diseaseNameKr} ${detail.severity} 상세`}
        tabIndex={-1}
        className="w-full rounded-2xl overflow-hidden flex flex-col focus:outline-none"
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
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(20,40,28,0.06)" }}
          >
            <X size={16} aria-hidden="true" style={{ color: "#616161" }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* 분석 사진 — 병변 영역(lesionArea)을 박스로 오버레이 */}
          {detail.imageUrl && (
            <div
              className="px-4 pt-3"
              style={{ borderBottom: "1px solid rgba(45,122,62,0.08)" }}
            >
              <div
                className="relative w-full rounded-xl overflow-hidden"
                style={{ aspectRatio: "4 / 3", backgroundColor: "#1a1a1a" }}
              >
                <img
                  src={detail.imageUrl}
                  alt={`${topResult.diseaseNameKr} 분석 사진`}
                  className="w-full h-full object-cover"
                />
                {detail.results
                  .filter((r) => r.lesionArea)
                  .map((r) => {
                    const c = getSeverityColor(r.severity);
                    return (
                      <div
                        key={r.id}
                        className="absolute"
                        style={{
                          left: `${r.lesionArea!.x}%`,
                          top: `${r.lesionArea!.y}%`,
                          width: `${r.lesionArea!.w}%`,
                          height: `${r.lesionArea!.h}%`,
                          border: `2px solid ${c.dot}`,
                          borderRadius: "4px",
                          backgroundColor: `${c.dot}26`,
                        }}
                      >
                        <span
                          className="absolute -top-5 left-0 px-1.5 py-0.5 rounded whitespace-nowrap"
                          style={{
                            backgroundColor: c.dot,
                            fontSize: "10px",
                            fontWeight: 700,
                            color: r.severity === "보통" ? "#333" : "white",
                          }}
                        >
                          {r.diseaseNameKr}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

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
                      · {item.cropName}
                      {item.weather &&
                        ` · 습도 ${item.weather.humidity}% · 온도 ${item.weather.temperature}°C`}
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
              {(topResult.treatmentSteps ?? []).length === 0 ? (
                <p
                  style={{
                    fontSize: "11px",
                    color: "#9E9E9E",
                    lineHeight: 1.6,
                  }}
                >
                  아직 등록된 회복·방제 방법이 없습니다. AI 상담으로 맞춤
                  방제법을 확인해 보세요.
                </p>
              ) : (
                (topResult.treatmentSteps ?? []).map((step) => (
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
                ))
              )}
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
