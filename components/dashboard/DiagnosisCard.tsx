import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getSeverityColor } from "@/lib/data/mockData";
import type { DiagnosisListItem } from "@/lib/types/diagnosis";
import { SeverityBadge } from "./SeverityBadge";
import { ConfidenceBar } from "./ConfidenceBar";

export function DiagnosisCard({
  record,
  selected,
  onSelect,
}: {
  record: DiagnosisListItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const colors = getSeverityColor(record.severity);
  const dateFormatted = new Date(record.diagnosedAt).toLocaleDateString(
    "ko-KR",
    {
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div
      className="rounded-2xl overflow-hidden bg-white transition-shadow"
      style={{
        border: `1.5px solid ${selected ? "rgb(var(--brand-green))" : "#EFEFEF"}`,
        boxShadow: selected
          ? "0 4px 16px rgba(45,122,62,0.12)"
          : "0 1px 3px rgba(20,40,28,0.06)",
      }}
    >
      <button className="w-full min-w-0 text-left" onClick={onSelect}>
        <div className="flex gap-3 p-4">
          <div className="relative flex-shrink-0 w-20 h-20">
            {record.imageUrl ? (
              <Image
                src={record.imageUrl}
                alt={record.cropName}
                fill
                className="object-cover rounded-xl"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-[#F0F0F0]" />
            )}
            {record.lesionArea && (
              <div
                className="absolute rounded-[3px]"
                style={{
                  left: `${record.lesionArea.x * 0.8}%`,
                  top: `${record.lesionArea.y * 0.8}%`,
                  width: `${record.lesionArea.w}%`,
                  height: `${record.lesionArea.h}%`,
                  border: `2px solid ${colors.dot}`,
                }}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {/* Meta — crop demoted to neutral text so it no longer competes
                with the severity badge */}
            <div className="flex items-center gap-1.5 mb-1 text-[11px]">
              <span className="font-semibold text-[#616161]">
                {record.cropName}
              </span>
              <span className="text-[#D0D0D0]">·</span>
              <span className="text-[#9E9E9E]">{dateFormatted}</span>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[17px] font-extrabold text-[#1a1a1a] truncate">
                {record.diseaseName}
              </span>
              <SeverityBadge severity={record.severity} />
            </div>
            <ConfidenceBar value={record.confidence} />
            <p
              className="mt-1.5 overflow-hidden text-xs text-[#757575]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
              }}
            >
              {record.description}
            </p>
          </div>
          <ChevronRight
            size={16}
            className="flex-shrink-0 self-center text-[#BDBDBD]"
          />
        </div>
      </button>
    </div>
  );
}
