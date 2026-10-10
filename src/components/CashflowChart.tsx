import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { useChartSize } from '../hooks/useChartSize';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { formatAxis, formatMoney } from '../utils/money';
import type { CashflowPoint } from '../utils/stats';

function isPoint(value: unknown): value is CashflowPoint {
  if (!value || typeof value !== 'object') return false;
  const point = value as CashflowPoint;
  return typeof point.fullLabel === 'string' && typeof point.income === 'number' && typeof point.expenses === 'number';
}

function CashflowTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!isPoint(point)) return null;
  return (
    <div className="chart-tip">
      <p className="font-semibold">{point.fullLabel}</p>
      <p className="mt-1 flex justify-between gap-4 text-sm">
        <span>Income</span>
        <span className="money">{formatMoney(point.income)}</span>
      </p>
      <p className="flex justify-between gap-4 text-sm">
        <span>Expenses</span>
        <span className="money">{formatMoney(point.expenses)}</span>
      </p>
    </div>
  );
}

type Props = {
  series: CashflowPoint[];
  caption: string;
};

export function CashflowChart({ series, caption }: Props) {
  const { ref, width, height, ready } = useChartSize();
  const reducedMotion = usePrefersReducedMotion();
  const hasActivity = series.some((point) => point.income > 0 || point.expenses > 0);

  return (
    <div>
      {hasActivity ? (
        <>
          <div ref={ref} className="h-64 w-full min-w-0 overflow-hidden" aria-hidden="true">
            {ready ? (
              <BarChart
                width={width}
                height={height}
                data={series}
                margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
                barGap={4}
              >
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={52}
                  tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
                  tickFormatter={(value: number) => formatAxis(Number(value))}
                />
                <Tooltip
                  content={(props) => <CashflowTooltip active={props.active} payload={props.payload} />}
                  cursor={{ fill: 'var(--surface-muted)' }}
                  wrapperStyle={{ outline: 'none', border: 'none', background: 'transparent', boxShadow: 'none' }}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="var(--income)"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={22}
                  isAnimationActive={!reducedMotion}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="var(--expense)"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={22}
                  isAnimationActive={!reducedMotion}
                />
              </BarChart>
            ) : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-[var(--income)]" aria-hidden="true" />
              Income
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-[var(--expense)]" aria-hidden="true" />
              Expenses
            </span>
          </div>
          <div className="visually-hidden">
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th>Month</th>
                <th>Income</th>
                <th>Expenses</th>
              </tr>
            </thead>
            <tbody>
              {series.map((point) => (
                <tr key={point.key}>
                  <td>{point.fullLabel}</td>
                  <td>{formatMoney(point.income)}</td>
                  <td>{formatMoney(point.expenses)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      ) : (
        <p className="py-10 text-center text-[var(--muted)]">No income or expenses in this six-month window.</p>
      )}
    </div>
  );
}
