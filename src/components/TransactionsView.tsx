import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Transaction, TransactionType } from '../types';
import { useBudget } from '../hooks/useBudget';
import { formatGroupDate, formatMonth, isInMonth } from '../utils/dates';
import { groupByDate, matchesQuery } from '../utils/transactions';
import { TransactionRow } from './TransactionRow';

type TypeFilter = 'all' | TransactionType;

type Props = {
  month: string;
  onAdd: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

export function TransactionsView({ month, onAdd, onEdit, onDelete }: Props) {
  const { data } = useBudget();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(
    () => new Map(data.categories.map((category) => [category.id, category])),
    [data.categories],
  );

  const monthTransactions = useMemo(
    () => data.transactions.filter((transaction) => isInMonth(transaction.date, month)),
    [data.transactions, month],
  );

  const categoryOptions = useMemo(
    () => data.categories.filter((category) => typeFilter === 'all' || category.kind === typeFilter),
    [data.categories, typeFilter],
  );

  const visible = useMemo(() => {
    return monthTransactions.filter((transaction) => {
      if (typeFilter !== 'all' && transaction.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && transaction.categoryId !== categoryFilter) return false;
      const category = categories.get(transaction.categoryId);
      return matchesQuery(transaction, category?.name ?? 'Uncategorized', query);
    });
  }, [monthTransactions, typeFilter, categoryFilter, categories, query]);

  const groups = useMemo(() => groupByDate(visible), [visible]);
  const monthLabel = formatMonth(month);
  const filtersActive = query.trim() !== '' || typeFilter !== 'all' || categoryFilter !== 'all';

  function changeType(next: TypeFilter) {
    setTypeFilter(next);
    setCategoryFilter((current) => {
      if (current === 'all' || next === 'all') return current;
      const category = categories.get(current);
      return category && category.kind !== next ? 'all' : current;
    });
  }

  function clearFilters() {
    setQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Activity</p>
          <h1 className="display mt-2 text-4xl">Transactions</h1>
          <p className="mt-2 text-[var(--muted)]">
            {monthTransactions.length === 0
              ? `Nothing recorded for ${monthLabel}.`
              : `${monthTransactions.length} ${monthTransactions.length === 1 ? 'entry' : 'entries'} in ${monthLabel}.`}
          </p>
        </div>
      </header>

      <div className="card space-y-4 p-4 sm:p-5">
        <div className="relative">
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--faint)]"
          />
          <input
            className="field field-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notes, categories, or amounts"
            aria-label="Search transactions"
          />
          {query ? (
            <button
              type="button"
              className="icon-btn absolute top-1/2 right-1 -translate-y-1/2"
              aria-label="Clear search"
              onClick={() => setQuery('')}
            >
              <X size={16} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Transaction type">
            {(
              [
                ['all', 'All'],
                ['income', 'Income'],
                ['expense', 'Expenses'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className="chip"
                aria-pressed={typeFilter === value}
                onClick={() => changeType(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="min-w-0 sm:w-56">
            <span className="sr-only">Category</span>
            <select
              className="field select"
              value={categoryFilter}
              aria-label="Filter by category"
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="all">All categories</option>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filtersActive ? (
          <div className="flex items-center justify-between gap-3 text-sm text-[var(--muted)]">
            <p>
              Showing {visible.length} of {monthTransactions.length}
            </p>
            <button type="button" className="btn-quiet" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        ) : null}
      </div>

      {monthTransactions.length === 0 ? (
        <div className="card px-5 py-12 text-center">
          <p className="text-[var(--muted)]">No income or expenses in {monthLabel}.</p>
          <button type="button" className="btn btn-primary mt-4" onClick={onAdd}>
            Add transaction
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="card px-5 py-12 text-center">
          <p className="text-[var(--muted)]">Nothing matches that search. Try another note, category, or amount.</p>
          <button type="button" className="btn btn-ghost mt-4" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <section key={group.date} className="card px-4 sm:px-5">
              <h2 className="border-b border-[var(--line)] pt-4 pb-2 text-sm font-semibold text-[var(--muted)]">
                {formatGroupDate(group.date)}
              </h2>
              <ul className="divide-y divide-[var(--line)]">
                {group.items.map((transaction) => (
                  <li key={transaction.id}>
                    <TransactionRow
                      transaction={transaction}
                      category={categories.get(transaction.categoryId)}
                      onEdit={() => onEdit(transaction)}
                      onDelete={() => onDelete(transaction)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
