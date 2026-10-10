import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonth, monthKey, shiftMonth } from '../utils/dates';

type Props = {
  month: string;
  onChange: (month: string) => void;
};

export function MonthSwitcher({ month, onChange }: Props) {
  const current = monthKey(new Date());

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="icon-btn"
          aria-label="Previous month"
          onClick={() => onChange(shiftMonth(month, -1))}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <p className="display w-[12.5rem] text-center text-xl whitespace-nowrap" aria-live="polite">
          {formatMonth(month)}
        </p>
        <button
          type="button"
          className="icon-btn"
          aria-label="Next month"
          onClick={() => onChange(shiftMonth(month, 1))}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
      {month !== current ? (
        <button type="button" className="btn btn-ghost" onClick={() => onChange(current)}>
          This month
        </button>
      ) : null}
    </div>
  );
}
