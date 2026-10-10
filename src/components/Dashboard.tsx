import { useMemo } from 'react';
import type { Transaction } from '../types';
import { useBudget } from '../hooks/useBudget';
import { formatMonth, shiftMonth } from '../utils/dates';
import { cashflowSeries, monthNarrative, monthTotals, spendingByCategory } from '../utils/stats';
import { compareTransactions } from '../utils/transactions';
import { CashflowChart } from './CashflowChart';
import { SpendingDonut } from './SpendingDonut';
import { StatCards } from './StatCards';
import { TransactionRow } from './TransactionRow';

type Props = {
  month: string;
  onAdd: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onViewAll: () => void;
};

export function Dashboard({ month, onAdd, onEdit, onDelete, onViewAll }: Props) {
  const { data } = useBudget();
  const totals = useMemo(() => monthTotals(data.transactions, month), [data.transactions, month]);
  const previous = useMemo(
    () => monthTotals(data.transactions, shiftMonth(month, -1)),
    [data.transactions, month],
  );
  const slices = useMemo(
    () => spendingByCategory(data.transactions, data.categories, month),
    [data.transactions, data.categories, month],
  );
  const series = useMemo(() => cashflowSeries(data.transactions, month, 6), [data.transactions, month]);
  const recent = useMemo(
    () => data.transactions.filter((transaction) => transaction.date.slice(0, 7) === month).sort(compareTransactions).slice(0, 6),
    [data.transactions, month],
  );
  const categories = useMemo(() => new Map(data.categories.map((category) => [category.id, category])), [data.categories]);
  const monthLabel = formatMonth(month);
  const narrative = monthNarrative(totals, monthLabel);
  const windowLabel = `${series[0]?.fullLabel ?? monthLabel} through ${series[series.length - 1]?.fullLabel ?? monthLabel}`;

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Dashboard</p>
        <h1 className="display mt-2 max-w-3xl text-3xl sm:text-4xl">{narrative}</h1>
      </header>

      <StatCards month={month} totals={totals} previous={previous} />

      <div className="grid min-w-0 gap-4 xl:grid-cols-5">
        <section className="card min-w-0 p-5 xl:col-span-2">
          <h2 className="text-lg font-semibold">Spending by category</h2>
          <p className="mb-4 text-sm text-[var(--muted)]">{monthLabel}</p>
          <SpendingDonut slices={slices} total={totals.expenses} />
        </section>
        <section className="card min-w-0 p-5 xl:col-span-3">
          <h2 className="text-lg font-semibold">Income and expenses</h2>
          <p className="mb-2 text-sm text-[var(--muted)]">Six months ending {monthLabel}</p>
          <CashflowChart series={series} caption={`Income and expenses, ${windowLabel}`} />
        </section>
      </div>

      <section className="card p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          {recent.length > 0 ? (
            <button type="button" className="btn-quiet" onClick={onViewAll}>
              View all
            </button>
          ) : null}
        </div>
        {recent.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-[var(--muted)]">This month is still a blank page.</p>
            <button type="button" className="btn btn-primary mt-4" onClick={onAdd}>
              Add transaction
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {recent.map((transaction) => (
              <li key={transaction.id}>
                <TransactionRow
                  transaction={transaction}
                  category={categories.get(transaction.categoryId)}
                  showDate
                  onEdit={() => onEdit(transaction)}
                  onDelete={() => onDelete(transaction)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
