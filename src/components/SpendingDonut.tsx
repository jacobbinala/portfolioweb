import { Pie, PieChart, Tooltip } from 'recharts';
import { useChartSize } from '../hooks/useChartSize';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { formatMoney, formatShare } from '../utils/money';
import type { SpendingSlice } from '../utils/stats';

function isSlice(value: unknown): value is SpendingSlice {
  if (!value || typeof value !== 'object') return false;
  const slice = value as SpendingSlice;
  return typeof slice.name === 'string' && typeof slice.value === 'number' && typeof slice.fill === 'string';
}

function SliceTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
}) {
  if (!active || !payload?.length) return null;
  const slice = payload[0]?.payload;
  if (!isSlice(slice)) return null;
  return (
    <div className="chart-tip">
      <p className="font-semibold">{slice.name}</p>
      <p className="money text-sm">
        {formatMoney(slice.value)} · {formatShare(slice.share)}
      </p>
    </div>
  );
}

type Props = {
  slices: SpendingSlice[];
  total: number;
};

export function SpendingDonut({ slices, total }: Props) {
  const { ref, width, height, ready } = useChartSize();
  const reducedMotion = usePrefersReducedMotion();

  if (slices.length === 0) {
    return (
      <p className="py-10 text-center text-[var(--muted)]">
        No expenses this month. Add one and it will show up here by category.
      </p>
    );
  }

  return (
    <div className="grid min-w-0 items-center gap-5">
      <div ref={ref} className="relative mx-auto h-52 w-full max-w-[200px] overflow-hidden" aria-hidden="true">
        {ready ? (
          <PieChart width={width} height={height} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="64%"
              outerRadius="96%"
              paddingAngle={slices.length > 1 ? 2 : 0}
              startAngle={90}
              endAngle={-270}
              stroke="var(--surface)"
              strokeWidth={2}
              isAnimationActive={!reducedMotion}
            />
            <Tooltip
              content={(props) => <SliceTooltip active={props.active} payload={props.payload} />}
              wrapperStyle={{ outline: 'none', border: 'none', background: 'transparent', boxShadow: 'none' }}
            />
          </PieChart>
        ) : null}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <span className="text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">Spent</span>
          <span className="display money text-xl">{formatMoney(total)}</span>
        </div>
      </div>
      <ul className="min-w-0 space-y-2">
        {slices.map((slice) => (
          <li key={slice.id} className="flex min-w-0 items-center gap-3 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: slice.fill }} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">{slice.name}</span>
            <span className="shrink-0 text-[var(--muted)]">{formatShare(slice.share)}</span>
            <span className="money shrink-0 text-right">{formatMoney(slice.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
