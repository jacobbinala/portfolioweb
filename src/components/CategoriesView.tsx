import { useEffect, useId, useMemo, useState, type FormEvent } from 'react';
import type { Category, TransactionType } from '../types';
import { useBudget } from '../hooks/useBudget';
import { deleteCategoryError } from '../utils/categories';
import { isInMonth } from '../utils/dates';
import { SWATCHES } from '../utils/defaults';
import { formatMoney, roundMoney } from '../utils/money';
import { ConfirmDialog } from './ConfirmDialog';

type Props = {
  month: string;
  monthLabel: string;
  notify: (message: string) => void;
  focusData: boolean;
  onFocusHandled: () => void;
  onSampleRestored: () => void;
  onCleared: () => void;
};

type ConfirmState = {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
};

type CategoryDraft = {
  id: string;
  name: string;
  color: string;
};

function scrollToData() {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  document.getElementById('data-tools')?.scrollIntoView({ behavior, block: 'start' });
}

export function CategoriesView({
  month,
  monthLabel,
  notify,
  focusData,
  onFocusHandled,
  onSampleRestored,
  onCleared,
}: Props) {
  const { data, addCategory, updateCategory, deleteCategory, resetSample, clearTransactions } = useBudget();
  const nameId = useId();
  const [name, setName] = useState('');
  const [kind, setKind] = useState<TransactionType>('expense');
  const [color, setColor] = useState<string>(SWATCHES[0]);
  const [formError, setFormError] = useState<string | null>(null);
  const [editing, setEditing] = useState<CategoryDraft | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  useEffect(() => {
    if (!focusData) return;
    scrollToData();
    onFocusHandled();
  }, [focusData, onFocusHandled]);

  const usage = useMemo(() => {
    const map = new Map<string, { amount: number; count: number }>();
    for (const transaction of data.transactions) {
      if (!isInMonth(transaction.date, month)) continue;
      const current = map.get(transaction.categoryId) ?? { amount: 0, count: 0 };
      current.amount = roundMoney(current.amount + transaction.amount);
      current.count += 1;
      map.set(transaction.categoryId, current);
    }
    return map;
  }, [data.transactions, month]);

  function submitCategory(event: FormEvent) {
    event.preventDefault();
    const result = addCategory({ name, color, kind });
    if (!result.ok) {
      setFormError(result.reason);
      return;
    }
    setName('');
    setColor(SWATCHES[0]);
    setFormError(null);
    notify('Category added.');
  }

  function saveEdit(kind: TransactionType) {
    if (!editing) return;
    const result = updateCategory(editing.id, { name: editing.name, color: editing.color, kind });
    if (!result.ok) {
      setEditError(result.reason);
      return;
    }
    setEditing(null);
    setEditError(null);
    notify('Category updated.');
  }

  function askRemove(category: Category) {
    const reason = deleteCategoryError(category, data.transactions);
    if (reason) {
      notify(reason);
      return;
    }
    setConfirm({
      title: 'Remove category',
      body: `Remove ${category.name}? Transactions are not affected because none use it.`,
      confirmLabel: 'Remove',
      onConfirm: () => {
        const result = deleteCategory(category.id);
        setConfirm(null);
        if (!result.ok) notify(result.reason);
        else notify('Category removed.');
      },
    });
  }

  const sections: { kind: TransactionType; title: string; copy: string }[] = [
    {
      kind: 'expense',
      title: 'Expense categories',
      copy: 'Housing, food, transport, entertainment, health, shopping, and other are built in. Add your own when a bill does not fit.',
    },
    {
      kind: 'income',
      title: 'Income categories',
      copy: 'Salary, freelance, and other income keep pay separate from spending on the dashboard.',
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Organize</p>
        <h1 className="display mt-2 text-4xl">Categories</h1>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          Each category has a color used on the spending chart. Totals below are for {monthLabel}.{' '}
          <button type="button" className="font-semibold text-[var(--ink)] underline" onClick={scrollToData}>
            Restore sample data or clear entries
          </button>
        </p>
      </header>

      <form className="card p-5" onSubmit={submitCategory}>
        <h2 className="text-lg font-semibold">New category</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <label className="label" htmlFor={nameId}>
              Name
            </label>
            <input
              id={nameId}
              className="field"
              value={name}
              maxLength={24}
              placeholder="Utilities, gifts, childcare"
              onChange={(event) => {
                setName(event.target.value);
                setFormError(null);
              }}
            />
          </div>
          <fieldset>
            <legend className="label">Kind</legend>
            <div className="flex gap-2">
              {(['expense', 'income'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className="chip"
                  aria-pressed={kind === value}
                  onClick={() => setKind(value)}
                >
                  {value === 'expense' ? 'Expense' : 'Income'}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <ColorPicker color={color} onChange={setColor} />
        {formError ? (
          <p className="field-error" role="alert">
            {formError}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary mt-4">
          Add category
        </button>
      </form>

      {sections.map((section) => (
        <section key={section.kind}>
          <h2 className="text-lg font-semibold">{section.title}</h2>
          <p className="mt-1 mb-3 max-w-2xl text-sm text-[var(--muted)]">{section.copy}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.categories
              .filter((category) => category.kind === section.kind)
              .map((category) => {
                const stats = usage.get(category.id) ?? { amount: 0, count: 0 };
                const isEditing = editing?.id === category.id;
                return (
                  <li key={category.id} className="card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{ background: isEditing ? editing.color : category.color }}
                          aria-hidden="true"
                        />
                        <h3 className="truncate font-semibold">{category.name}</h3>
                      </div>
                      <span className="rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs font-semibold text-[var(--muted)]">
                        {category.builtIn ? 'Default' : 'Custom'}
                      </span>
                    </div>
                    <p className="display money mt-3 text-2xl">{formatMoney(stats.amount)}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {stats.count === 0
                        ? 'No transactions this month'
                        : `${stats.count} ${stats.count === 1 ? 'transaction' : 'transactions'} this month`}
                    </p>
                    {isEditing ? (
                      <div className="mt-4">
                        <label className="label" htmlFor={`edit-${category.id}`}>
                          Name
                        </label>
                        <input
                          id={`edit-${category.id}`}
                          className="field"
                          value={editing.name}
                          maxLength={24}
                          onChange={(event) => {
                            setEditing({ ...editing, name: event.target.value });
                            setEditError(null);
                          }}
                        />
                        <ColorPicker color={editing.color} onChange={(next) => setEditing({ ...editing, color: next })} />
                        {editError ? (
                          <p className="field-error" role="alert">
                            {editError}
                          </p>
                        ) : null}
                        <div className="mt-3 flex gap-2">
                          <button type="button" className="btn btn-primary" onClick={() => saveEdit(category.kind)}>
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => {
                              setEditing(null);
                              setEditError(null);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : category.builtIn ? null : (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => {
                            setEditing({ id: category.id, name: category.name, color: category.color });
                            setEditError(null);
                          }}
                        >
                          Edit
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={() => askRemove(category)}>
                          Remove
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
          </ul>
        </section>
      ))}

      <section id="data-tools" className="card scroll-mt-28 p-5">
        <h2 className="text-lg font-semibold">Your data</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Harbor keeps this budget in your browser. Nothing is uploaded. Sample data covers the current month and the
          two before it, so the dashboard is useful the first time you open it.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              setConfirm({
                title: 'Restore sample data',
                body: 'This replaces your transactions and any categories you added with three months of example activity. The change stays on this device.',
                confirmLabel: 'Restore sample',
                onConfirm: () => {
                  resetSample();
                  setConfirm(null);
                  setEditing(null);
                  notify('Sample data restored.');
                  onSampleRestored();
                },
              })
            }
          >
            Restore sample data
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() =>
              setConfirm({
                title: 'Clear transactions',
                body: 'Every income and expense entry will be removed. Categories you added stay in place.',
                confirmLabel: 'Clear transactions',
                onConfirm: () => {
                  clearTransactions();
                  setConfirm(null);
                  notify('All transactions removed.');
                  onCleared();
                },
              })
            }
          >
            Clear transactions
          </button>
        </div>
      </section>

      {confirm ? (
        <ConfirmDialog
          title={confirm.title}
          body={confirm.body}
          confirmLabel={confirm.confirmLabel}
          onConfirm={confirm.onConfirm}
          onClose={() => setConfirm(null)}
        />
      ) : null}
    </div>
  );
}

function ColorPicker({ color, onChange }: { color: string; onChange: (color: string) => void }) {
  return (
    <fieldset className="mt-4">
      <legend className="label">Color</legend>
      <div className="flex flex-wrap items-center gap-2">
        {SWATCHES.map((swatch) => {
          const selected = color.toLowerCase() === swatch;
          return (
            <button
              key={swatch}
              type="button"
              className="h-8 w-8 rounded-full"
              style={{
                background: swatch,
                boxShadow: selected ? '0 0 0 2px var(--surface), 0 0 0 4px var(--ink)' : undefined,
              }}
              aria-label={`Use color ${swatch}`}
              aria-pressed={selected}
              onClick={() => onChange(swatch)}
            />
          );
        })}
        <label
          className="relative h-8 w-8 overflow-hidden rounded-full border border-[var(--line)]"
          style={{ background: color }}
          title="Custom color"
        >
          <span className="sr-only">Custom color</span>
          <input
            type="color"
            className="absolute inset-0 cursor-pointer opacity-0"
            value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : SWATCHES[0]}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
      </div>
    </fieldset>
  );
}
