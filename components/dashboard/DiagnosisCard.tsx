import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { DiagnosisRecord, getSeverityColor } from "@/lib/data/mockData";
import { SeverityBadge } from "./SeverityBadge";
import { ConfidenceBar } from "./ConfidenceBar";

export function DiagnosisCard({
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
      className="rounded-2xl overflow-hidden shadow-sm bg-white"
      style={{ border: `1.5px solid ${selected ? "#2D7A3E" : "#F0F0F0"}` }}
    >
      <button className="w-full text-left" onClick={onSelect}>
        <div className="flex gap-3 p-4">
          <div className="relative flex-shrink-0 w-20 h-20">
            <Image
              src={record.imageUrl}
              alt={record.crop}
              fill
              className="object-cover rounded-xl"
              sizes="80px"
            />
            <div
              className="absolute rounded-[3px]"
              style={{
                left: `${topResult.lesionArea.x * 0.8}%`,
                top: `${topResult.lesionArea.y * 0.8}%`,
                width: `${topResult.lesionArea.w}%`,
                height: `${topResult.lesionArea.h}%`,
                border: `2px solid ${colors.dot}`,
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] text-[#9E9E9E]">
                {dateFormatted}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: "#E8F5E9", color: "#2D7A3E" }}
              >
                {record.crop}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[17px] font-extrabold text-[#1a1a1a]">
                {topResult.diseaseKr}
              </span>
              <SeverityBadge severity={record.primarySeverity} />
            </div>
            <ConfidenceBar value={topResult.confidence} />
            <p
              className="mt-1.5 overflow-hidden text-xs text-[#757575]"
              style={{
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
            className="flex-shrink-0 self-center text-[#BDBDBD]"
          />
        </div>
      </button>
    </div>
  );
}
