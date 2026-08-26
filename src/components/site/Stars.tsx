/** Accurate star rendering, including fractional ratings such as 4.5 / 5. */
export function Stars({ value, className = "" }: { value: number; className?: string }) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div className={`flex items-center gap-1 text-primary ${className}`} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block h-4 w-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="absolute inset-0 h-4 w-4 opacity-25">
              <path d="m12 17.3 6.2 3.7-1.6-7 5.4-4.7-7.1-.6L12 2 9.1 8.7 2 9.3l5.4 4.7-1.6 7z" />
            </svg>
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="m12 17.3 6.2 3.7-1.6-7 5.4-4.7-7.1-.6L12 2 9.1 8.7 2 9.3l5.4 4.7-1.6 7z" />
              </svg>
            </span>
          </span>
        );
      })}
      <span className="ml-1 text-[0.65rem] text-muted-foreground">{rating.toFixed(1)}/5</span>
    </div>
  );
}
