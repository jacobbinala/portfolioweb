export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 32 32" className="h-9 w-9 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#0f5e58" />
        <path
          d="M7 21.5c3.2-7 14.8-7 18 0"
          fill="none"
          stroke="#f6f3ec"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M11.2 21.5c1.9-3.8 7.7-3.8 9.6 0"
          fill="none"
          stroke="#f6f3ec"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <p className="display text-2xl leading-none">Harbor</p>
        {compact ? null : <p className="mt-1 text-sm text-[var(--muted)]">Personal budget</p>}
      </div>
    </div>
  );
}
