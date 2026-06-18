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
import { DIAGNOSIS_RECORDS, getSeverityColor } from "@/lib/data/mockData";
import { useCrops } from "@/lib/queries/useCrops";

const BRAND_GREEN = "rgb(var(--brand-green))";
const ACCENT_ORANGE = "rgb(var(--accent-orange))";

type Stage = "ready" | "captured" | "analyzing" | "quick_result" | "complete";

export default function DiagnosisPage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [stage, setStage] = useState<Stage>("ready");
  const [selectedCrop, setSelectedCrop] = useState("고추");
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  const [progress, setProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState("");

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const { data: crops } = useCrops();
  const mockRecord = DIAGNOSIS_RECORDS[0];
  const severityColors = getSeverityColor("심각");

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

  const startAnalysis = () => {
    setStage("analyzing");
    setProgress(0);
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15 + 5;
      if (prog >= 60) {
        setProgress(60);
        clearInterval(interval);
        setStage("quick_result");
        setTimeout(() => {
          let prog2 = 60;
          const interval2 = setInterval(() => {
            prog2 += Math.random() * 10 + 5;
            setProgress(Math.min(prog2, 100));
            if (prog2 >= 100) {
              clearInterval(interval2);
              setStage("complete");
            }
          }, 200);
        }, 2000);
      } else {
        setProgress(prog);
      }
    }, 150);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 선택해도 onChange가 발생하도록 value 초기화
    e.target.value = "";
    if (!file || !isOnline) return;

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    setCapturedImage(url);
    setStage("captured");
    setTimeout(() => startAnalysis(), 600);
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
              <span>이천시</span>
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
              mockRecord.results.map((result) => (
                <div
                  key={result.id}
                  className="absolute"
                  style={{
                    left: `${result.lesionArea.x}%`,
                    top: `${result.lesionArea.y}%`,
                    width: `${result.lesionArea.w}%`,
                    height: `${result.lesionArea.h}%`,
                    border: `2px solid ${result.severity === "심각" ? "#F44336" : result.severity === "보통" ? "#FFC107" : "#4CAF50"}`,
                    borderRadius: "4px",
                    backgroundColor:
                      result.severity === "심각"
                        ? "rgba(244,67,54,0.15)"
                        : result.severity === "보통"
                          ? "rgba(255,193,7,0.15)"
                          : "rgba(76,175,80,0.15)",
                  }}
                >
                  <span
                    className="absolute -top-5 left-0 px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor:
                        result.severity === "심각"
                          ? "#F44336"
                          : result.severity === "보통"
                            ? "#FFC107"
                            : "#4CAF50",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: result.severity === "보통" ? "#333" : "white",
                    }}
                  >
                    {result.diseaseKr}
                  </span>
                </div>
              ))}

            {(stage === "analyzing" || stage === "quick_result") && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(2px)",
                }}
              >
                {stage === "analyzing" ? (
                  <>
                    <div
                      className="w-12 h-12 rounded-full border-4 mb-3 spin-anim"
                      style={{
                        borderColor: "rgba(255,255,255,0.3)",
                        borderTopColor: "#FF6B35",
                      }}
                    />
                    <p
                      style={{
                        color: "white",
                        fontSize: "15px",
                        fontWeight: 600,
                      }}
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
                  </>
                ) : (
                  <>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                      style={{ backgroundColor: "#FFF3E0" }}
                    >
                      <AlertTriangle size={20} style={{ color: "#FF6B35" }} />
                    </div>
                    <p
                      style={{
                        color: "white",
                        fontSize: "15px",
                        fontWeight: 700,
                      }}
                    >
                      이상 의심 부위 발견
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      정밀 분석 중...
                    </p>
                    <div
                      className="mt-3 w-48 h-1.5 rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: "#FFC107",
                        }}
                      />
                    </div>
                  </>
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
      {stage === "complete" && (
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
                탄저병 (Anthracnose) - 심각
              </p>
              <p style={{ fontSize: "11px", color: severityColors.text }}>
                신뢰도 92% · 고추 · 이천시
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
                탄저병은 고추에서 가장 흔하게 발생하는 곰팡이성 병해로,
                고온다습한 환경에서 급속히 확산됩니다. 열매 표면에 움푹 들어간
                갈색 반점이 나타나며, 심한 경우 전체 과실이 썩게 됩니다.
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
              <div className="space-y-2">
                {[
                  {
                    region: "경기 여주시",
                    env: "비닐하우스 재배 환경, 습도 85%, 온도 28°C",
                    color: "#F44336",
                  },
                  {
                    region: "충남 천안시",
                    env: "노지 재배, 장마 기간 중 발병, 습도 90%",
                    color: "#F44336",
                  },
                  {
                    region: "경기 용인시",
                    env: "시설재배, 통풍 불량, 밀식 환경",
                    color: "#FFC107",
                  },
                  {
                    region: "강원 홍천군",
                    env: "노지 재배, 습도 75%, 조기 예방 살포",
                    color: "#4CAF50",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div
                      className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#616161",
                        lineHeight: 1.5,
                      }}
                    >
                      <strong style={{ color: "#333" }}>{item.region}</strong> ·{" "}
                      {item.env}
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
                  color: BRAND_GREEN,
                  marginBottom: "6px",
                }}
              >
                💊 회복 및 방제 방법
              </h4>
              <div className="space-y-2">
                {[
                  "감염된 과실 및 잎 즉시 제거 후 소각 처리 (전염 차단)",
                  "살균제 살포: 디페노코나졸 또는 프로피네브 수화제 (7일 간격 3회)",
                  "통풍 개선 및 습도 관리 (70% 이하 유지), 과습 방지",
                  "칼슘제 엽면 살포로 과피 강화, 저항성 증진",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        backgroundColor: BRAND_GREEN,
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
              onClick={() => router.push("/chat")}
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
              {stage === "captured"
                ? "사진 업로드 중..."
                : stage === "analyzing"
                  ? "AI 분석 중..."
                  : "1차 결과 확인 중..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
