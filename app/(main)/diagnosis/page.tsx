"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Image,
  MapPin,
  Clock,
  ChevronDown,
  Check,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { getSeverityColor } from "@/lib/data/mockData";
import { getCrops } from "@/lib/api/crop";
import { resolveCurrentLocation } from "@/lib/api/geocode";
import { useCrops } from "@/lib/queries/useCrops";
import {
  useCreateDiagnosis,
  useSimilarCases,
} from "@/lib/queries/useDiagnoses";
import { useQueryClient } from "@tanstack/react-query";
import type { DiagnoseResponse } from "@/lib/types/diagnosis";

// 콜드 스타트 알림을 띄우기까지 대기 시간(ms). 첫 진단은 백엔드 콜드 스타트
// + 모델 로딩으로 오래 걸릴 수 있어, 이 시간을 넘기면 안내 문구를 보여준다.
const LONG_WAIT_MS = 15000;

const BRAND_GREEN = "rgb(var(--brand-green))";
const ACCENT_ORANGE = "rgb(var(--accent-orange))";

// GPS 권한 거부·역지오코딩 실패 시 사용할 폴백 지역 (POST /diagnoses location 필드)
const DEFAULT_LOCATION = "경기도 이천시";

type Stage = "ready" | "analyzing" | "complete";

// 심각도별 병변 박스 색상
function lesionColor(severity: string): string {
  if (severity === "심각") return "#F44336";
  if (severity === "보통") return "#FFC107";
  return "#4CAF50";
}

export default function DiagnosisPage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [stage, setStage] = useState<Stage>("ready");
  const [selectedCrop, setSelectedCrop] = useState("고추");
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  const [progress, setProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  // POST /diagnoses 응답(상세 전체)을 그대로 보관해 결과 화면을 채운다.
  const [result, setResult] = useState<DiagnoseResponse | null>(null);
  // 분석이 오래(콜드 스타트) 걸릴 때 안내 문구 노출 여부.
  const [longWait, setLongWait] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  // 진단에 보낼 위치. 진입 시 GPS로 해석하며, 해석 전/실패 시 폴백을 사용한다.
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const queryClient = useQueryClient();
  const { data: crops } = useCrops();
  const createDiagnosis = useCreateDiagnosis();
  // 유사 사례는 POST 응답에 없으므로 진단 id(UUID)로 별도 조회 (실패해도 화면은 정상).
  const { data: similarCases } = useSimilarCases(result?.id ?? null);

  // 대표 결과(rank 1) — 없으면 첫 결과
  const primary =
    result?.results.find((r) => r.rank === 1) ?? result?.results[0] ?? null;
  const severityColors = getSeverityColor(result?.severity ?? "경미");

  // 컴포넌트 unmount 시 생성한 objectURL 해제 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    const update = () =>
      setTimeStr(
        new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  // 워밍업 핑 — 진단 페이지 진입 시 가벼운 요청(GET /crops)을 한 번 보내
  // 백엔드 콜드 스타트를 사용자가 사진을 올리기 전에 미리 당겨둔다.
  // (컨테이너 기동을 앞당기는 효과. AI 모델 로딩은 추론 시점에 일어나므로
  //  완전한 제거는 백엔드 워밍업/min-instances가 필요하다.) 실패는 무시.
  useEffect(() => {
    getCrops().catch(() => {});
  }, []);

  // 진입 시 현재 위치(GPS)를 행정구역명으로 해석해 둔다. 권한 거부·실패 시 폴백 유지.
  // 사진 촬영 시점에 이미 해석돼 있도록 미리 한 번만 시도한다.
  useEffect(() => {
    let active = true;
    resolveCurrentLocation(DEFAULT_LOCATION).then((loc) => {
      if (active) setLocation(loc);
    });
    return () => {
      active = false;
    };
  }, []);

  // 분석(업로드+추론) 동안 진행률 애니메이션 — 완료 전까지 90%에서 대기
  useEffect(() => {
    if (stage !== "analyzing") return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + Math.random() * 12 + 4));
    }, 180);
    return () => clearInterval(interval);
  }, [stage]);

  // 분석이 LONG_WAIT_MS를 넘기면 "오래 걸릴 수 있다" 안내를 띄운다.
  useEffect(() => {
    if (stage !== "analyzing") {
      setLongWait(false);
      return;
    }
    const timer = setTimeout(() => setLongWait(true), LONG_WAIT_MS);
    return () => clearTimeout(timer);
  }, [stage]);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 선택해도 onChange가 발생하도록 value 초기화
    e.target.value = "";
    if (!file || !isOnline) return;

    const cropId = crops?.find((c) => c.name === selectedCrop)?.id;
    if (!cropId) {
      alert("작물 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    setCapturedImage(url);
    setResult(null);
    setProgress(0);
    setStage("analyzing");

    createDiagnosis.mutate(
      { cropId, location, image: file },
      {
        onSuccess: (res) => {
          // POST 응답이 상세 전체를 주므로 추가 조회 없이 바로 결과 표시.
          setResult(res);
          setProgress(100);
          setStage("complete");
        },
        onError: () => {
          // 콜드 스타트로 응답이 끊겨도 백엔드는 추론을 끝내고 기록을 저장했을 수
          // 있다. 그래서 기록 목록을 갱신해 두고, 기록에서 확인하도록 안내한다.
          queryClient.invalidateQueries({ queryKey: ["diagnoses", "list"] });
          alert(
            "분석이 오래 걸리고 있어요. 첫 진단은 1~2분 걸릴 수 있습니다.\n잠시 후 '기록'에서 결과를 확인하거나 다시 시도해주세요.",
          );
          reset();
        },
      },
    );
  };

  const openCamera = () => {
    if (!isOnline) return;
    cameraInputRef.current?.click();
  };

  const openGallery = () => {
    if (!isOnline) return;
    galleryInputRef.current?.click();
  };

  const reset = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setStage("ready");
    setProgress(0);
    setCapturedImage(null);
    setResult(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 실제 카메라 촬영 (후면 카메라 우선) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelected}
      />
      {/* 갤러리에서 사진 선택 */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />

      {!isOnline && (
        <div
          className="flex items-center justify-center gap-2 py-2 px-4"
          style={{
            backgroundColor: "#F44336",
            color: "white",
            fontSize: "13px",
          }}
        >
          <AlertTriangle size={14} />
          네트워크 연결 끊김 — 연결 복구 후 진단 가능
        </div>
      )}

      {/* Crop selector */}
      <div className="px-5 pt-3 pb-2 relative z-20">
        <div className="flex items-center gap-2">
          <span
            style={{
              fontSize: "13px",
              color: "rgb(var(--glass-text) / 0.7)",
              fontWeight: 500,
            }}
          >
            작물 선택
          </span>
          <button
            onClick={() => setShowCropDropdown(!showCropDropdown)}
            className="glass-pill-green flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#2D7A3E",
            }}
          >
            {selectedCrop}
            <ChevronDown size={14} />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div
              className="flex items-center gap-1"
              style={{
                fontSize: "11px",
                color: "rgb(var(--glass-text) / 0.6)",
              }}
            >
              <MapPin size={11} />
              <span>{location.split(" ").pop() || location}</span>
            </div>
            <div
              className="flex items-center gap-1"
              style={{
                fontSize: "11px",
                color: "rgb(var(--glass-text) / 0.6)",
              }}
            >
              <Clock size={11} />
              <span>{timeStr}</span>
            </div>
          </div>
        </div>
        {showCropDropdown && (
          <div
            className="glass-card-strong absolute top-12 left-5 rounded-xl overflow-hidden z-30"
            style={{ width: "200px" }}
          >
            {(crops ?? []).map((crop) => (
              <button
                key={crop.id}
                onClick={() => {
                  setSelectedCrop(crop.name);
                  setShowCropDropdown(false);
                }}
                className="glass-row w-full flex items-center justify-between px-4 py-3"
                style={{
                  fontSize: "14px",
                  color:
                    crop.name === selectedCrop
                      ? "#2D7A3E"
                      : "rgb(var(--glass-text) / 0.8)",
                  borderBottom: "1px solid rgb(var(--glass-accent) / 0.1)",
                }}
              >
                {crop.name}
                {crop.name === selectedCrop && (
                  <Check size={14} style={{ color: "#2D7A3E" }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Camera / Preview */}
      <div
        className="relative mx-5 rounded-2xl overflow-hidden shadow-md"
        style={{
          height: stage === "complete" ? "240px" : "auto",
          flex: stage === "complete" ? "none" : "1",
          minHeight: stage === "complete" ? "auto" : "0",
        }}
      >
        {stage === "ready" ? (
          <div
            className="w-full h-full flex flex-col items-center justify-center relative"
            style={{ backgroundColor: "#1a1a1a", minHeight: "320px" }}
          >
            {[
              "top-4 left-4",
              "top-4 right-4",
              "bottom-4 left-4",
              "bottom-4 right-4",
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-8 h-8`}
                style={{
                  borderTop: i < 2 ? "3px solid #FF6B35" : "none",
                  borderBottom: i >= 2 ? "3px solid #FF6B35" : "none",
                  borderLeft: i % 2 === 0 ? "3px solid #FF6B35" : "none",
                  borderRight: i % 2 === 1 ? "3px solid #FF6B35" : "none",
                }}
              />
            ))}
            <div className="text-center">
              <Camera
                size={48}
                style={{
                  color: "rgba(255,255,255,0.4)",
                  margin: "0 auto 12px",
                }}
              />
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                작물을 카메라에 맞춰주세요
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                병든 잎이나 열매를 화면 중앙에 위치시키세요
              </p>
            </div>
            <div
              className="absolute left-0 right-0 h-0.5 opacity-50 scan-line"
              style={{ backgroundColor: "#FF6B35", top: "50%" }}
            />
          </div>
        ) : (
          <div
            className="relative w-full h-full"
            style={{ minHeight: stage === "complete" ? "auto" : "320px" }}
          >
            <img
              src={capturedImage!}
              alt="촬영된 작물"
              className="w-full h-full object-cover"
            />

            {stage === "complete" &&
              result?.results
                .filter((r) => r.lesionArea)
                .map((r) => (
                  <div
                    key={r.id}
                    className="absolute"
                    style={{
                      left: `${r.lesionArea!.x}%`,
                      top: `${r.lesionArea!.y}%`,
                      width: `${r.lesionArea!.w}%`,
                      height: `${r.lesionArea!.h}%`,
                      border: `2px solid ${lesionColor(r.severity)}`,
                      borderRadius: "4px",
                      backgroundColor:
                        r.severity === "심각"
                          ? "rgba(244,67,54,0.15)"
                          : r.severity === "보통"
                            ? "rgba(255,193,7,0.15)"
                            : "rgba(76,175,80,0.15)",
                    }}
                  >
                    <span
                      className="absolute -top-5 left-0 px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: lesionColor(r.severity),
                        fontSize: "10px",
                        fontWeight: 700,
                        color: r.severity === "보통" ? "#333" : "white",
                      }}
                    >
                      {r.diseaseNameKr}
                    </span>
                  </div>
                ))}

            {stage === "analyzing" && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(2px)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full border-4 mb-3 spin-anim"
                  style={{
                    borderColor: "rgba(255,255,255,0.3)",
                    borderTopColor: "#FF6B35",
                  }}
                />
                <p
                  style={{ color: "white", fontSize: "15px", fontWeight: 600 }}
                >
                  AI가 분석하고 있습니다
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  잠시만 기다려 주세요...
                </p>
                <div
                  className="mt-4 w-48 h-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: "#FF6B35",
                    }}
                  />
                </div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "11px",
                    marginTop: "6px",
                  }}
                >
                  {Math.round(progress)}%
                </p>
                {longWait && (
                  <p
                    className="px-6 text-center"
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "11px",
                      marginTop: "10px",
                      lineHeight: 1.5,
                    }}
                  >
                    첫 진단은 서버 준비로 1~2분 걸릴 수 있어요.
                    <br />
                    조금만 더 기다려 주세요.
                  </p>
                )}
              </div>
            )}

            {stage === "complete" && (
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: BRAND_GREEN,
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <Check size={12} />
                진단 완료
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick result summary */}
      {stage === "complete" && result && primary && (
        <div
          className="glass-card-strong mx-5 mt-3 rounded-2xl overflow-hidden flex flex-col"
          style={{
            border: `1.5px solid ${severityColors.dot}`,
            maxHeight: "320px",
          }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
            style={{ backgroundColor: severityColors.bg }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: severityColors.dot }}
            >
              <AlertTriangle size={14} style={{ color: "white" }} />
            </div>
            <div className="flex-1">
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: severityColors.text,
                }}
              >
                {primary.diseaseNameKr} ({primary.diseaseName}) -{" "}
                {result.severity}
              </p>
              <p style={{ fontSize: "11px", color: severityColors.text }}>
                신뢰도 {primary.confidence}% · {result.cropName} ·{" "}
                {result.location}
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div
              className="px-4 py-3"
              style={{ borderBottom: "1px solid #F5F5F5" }}
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
                {primary.description || "상세 설명이 제공되지 않았습니다."}
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
                  color: ACCENT_ORANGE,
                  marginBottom: "6px",
                }}
              >
                📊 최근 유사 사례
              </h4>
              {similarCases && similarCases.length > 0 ? (
                <div className="space-y-2">
                  {similarCases.map((item) => (
                    <div key={item.id} className="flex items-start gap-2">
                      <div
                        className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: lesionColor(item.severity) }}
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
                        · {item.cropName} · {item.severity}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "11px", color: "#9E9E9E" }}>
                  유사 사례가 없습니다
                </p>
              )}
            </div>

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
              {primary.treatmentSteps && primary.treatmentSteps.length > 0 ? (
                <div className="space-y-2">
                  {primary.treatmentSteps.map((step) => (
                    <div
                      key={step.stepOrder}
                      className="flex items-start gap-2"
                    >
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
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#333",
                          lineHeight: 1.6,
                        }}
                      >
                        <strong>{step.title}</strong> — {step.description}
                        {step.chemical ? ` (${step.chemical})` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "11px", color: "#9E9E9E" }}>
                  방제 정보가 없습니다
                </p>
              )}
              {primary.source && (
                <p
                  style={{
                    fontSize: "10px",
                    color: "#9E9E9E",
                    marginTop: "8px",
                  }}
                >
                  출처: {primary.source}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div className="px-5 py-4 flex flex-col gap-3">
        {stage === "ready" ? (
          <>
            <div className="flex items-center justify-between">
              <button
                onClick={openGallery}
                disabled={!isOnline}
                className="glass-pill w-12 h-12 rounded-2xl flex items-center justify-center disabled:opacity-50"
              >
                <Image
                  size={22}
                  style={{ color: "rgb(var(--glass-text) / 0.7)" }}
                />
              </button>
              <button
                onClick={openCamera}
                disabled={!isOnline}
                className="relative flex items-center justify-center rounded-full shadow-lg active:scale-95 transition-transform"
                style={{
                  width: "72px",
                  height: "72px",
                  backgroundColor: isOnline ? "#FF6B35" : "#BDBDBD",
                }}
              >
                <div className="absolute inset-2 rounded-full border-2 border-white opacity-50" />
                <Camera size={28} style={{ color: "white" }} />
              </button>
              <div className="w-12" />
            </div>
            <p
              className="text-center"
              style={{
                fontSize: "12px",
                color: "rgb(var(--glass-text) / 0.55)",
              }}
            >
              버튼을 눌러 촬영하거나 갤러리에서 사진을 선택하세요
            </p>
          </>
        ) : stage === "complete" ? (
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="glass-pill flex items-center justify-center gap-1 px-4 py-3 rounded-xl"
              style={{
                color: "rgb(var(--glass-text) / 0.85)",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              <RotateCcw size={16} />
              다시
            </button>
            <button
              // 실 진단 id(UUID)를 chat으로 전달 → type:"diagnosis" 세션이 생성된다.
              onClick={() =>
                router.push(result ? `/chat?diagnosisId=${result.id}` : "/chat")
              }
              className="flex-1 py-3 rounded-xl"
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
        ) : (
          <div className="glass-pill flex items-center justify-center py-3 rounded-xl">
            <p
              style={{
                fontSize: "13px",
                color: "rgb(var(--glass-text) / 0.7)",
              }}
            >
              AI 분석 중...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
