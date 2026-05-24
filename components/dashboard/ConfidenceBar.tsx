export function ConfidenceBar({ value }: { value: number }) {
  const barColor =
    value >= 85 ? "#F44336" : value >= 70 ? "#FFC107" : "#4CAF50";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[#F0F0F0]">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: barColor }}
        />
      </div>
      <span className="text-xs font-bold text-[#333] min-w-[32px] text-right">
        {value}%
      </span>
    </div>
  );
}
