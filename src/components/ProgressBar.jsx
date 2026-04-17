export default function ProgressBar({ filled, total }) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-neutral-500 mb-1">
        <span>Fortschritt</span>
        <span>{filled} / {total}</span>
      </div>
      <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-neutral-900 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
