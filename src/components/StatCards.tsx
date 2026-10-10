import { shiftMonth, shortMonth } from '../utils/dates';
import { formatMoney } from '../utils/money';
import { deltaText, type MonthTotals } from '../utils/stats';

type Kind = 'income' | 'expenses' | 'net';

type Props = {
  month: string;
  totals: MonthTotals;
  previous: MonthTotals;
};

const CARDS: { kind: Kind; label: string; field: keyof Pick<MonthTotals, 'income' | 'expenses' | 'net'> }[] = [
  { kind: 'income', label: 'Income', field: 'income' },
  { kind: 'expenses', label: 'Expenses', field: 'expenses' },
  { kind: 'net', label: 'Net savings', field: 'net' },
];

function deltaColor(kind: Kind, direction: 'up' | 'down' | 'flat'): string {
  if (direction === 'flat') return 'var(--muted)';
  const favorable = kind === 'expenses' ? direction === 'down' : direction === 'up';
  return favorable ? 'var(--income)' : 'var(--expense)';
}

export function StatCards({ month, totals, previous }: Props) {
  const comparison = shortMonth(shiftMonth(month, -1), month);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {CARDS.map((card) => {
        const value = totals[card.field];
        const delta = deltaText(value, previous[card.field], comparison);
        const accent = card.kind === 'expenses' ? 'var(--expense)' : 'var(--income)';
        return (
          <article
            key={card.kind}
            className="card px-4 py-4 sm:px-5"
            style={{
              borderTop: `3px solid ${accent}`,
              background: card.kind === 'net' && value >= 0 ? 'var(--accent-soft)' : undefined,
            }}
          >
            <p className="text-sm font-semibold text-[var(--muted)]">{card.label}</p>
            <p className="display money mt-2 text-3xl sm:text-[2rem]">{formatMoney(value)}</p>
            {delta ? (
              <p className="money mt-2 text-sm" style={{ color: deltaColor(card.kind, delta.direction) }}>
                {delta.text}
              </p>
            ) : (
              <p className="mt-2 text-sm text-[var(--faint)]">No activity the month before</p>
            )}
          </article>
        );
      })}
    </div>
  );
}
