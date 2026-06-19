"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Info, Calendar, ChevronDown } from "lucide-react";
import { DiagnosisCard } from "@/components/dashboard/DiagnosisCard";
import { DiseaseDetailModal } from "@/components/disease/DiseaseDetailModal";
import {
  useDiagnoses,
  useDiagnosisDetail,
  useSimilarCases,
  useUpdateTreatmentStatus,
} from "@/lib/queries/useDiagnoses";
import { useCrops } from "@/lib/queries/useCrops";

type FilterSeverity = "전체" | "심각" | "보통" | "경미";

export default function DashboardPage() {
  const router = useRouter();
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>("전체");
  const [filterCrop, setFilterCrop] = useState<string>("전체");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);
  const [showCropDropdown, setShowCropDropdown] = useState(false);

  const { data, isLoading, isError } = useDiagnoses();
  const { data: crops } = useCrops();
  const { data: detail } = useDiagnosisDetail(selectedId);
  const cropFilterOptions = ["전체", ...(crops ?? []).map((c) => c.name)];
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
      <div className="min-h-0 flex-1 overflow-y-auto">
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
                  {cropFilterOptions.map((c) => (
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
      {selectedId !== null && detail && (
        <DiseaseDetailModal
          detail={detail}
          similarCases={similarCases}
          onClose={() => setSelectedId(null)}
          onToggleTreatment={() =>
            updateStatus.mutate({
              id: detail.id,
              treatmentStatus:
                detail.treatmentStatus === "방제 완료"
                  ? "방제 필요"
                  : "방제 완료",
            })
          }
          isUpdatingTreatment={updateStatus.isPending}
          onStartChat={() => router.push(`/chat?diagnosisId=${detail.id}`)}
        />
      )}
    </div>
  );
}
