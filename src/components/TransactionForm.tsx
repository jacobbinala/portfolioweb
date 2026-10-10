import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import type { Category, Transaction, TransactionInput, TransactionType } from '../types';
import { defaultDateForMonth, isRealDate } from '../utils/dates';
import { amountToInput, readAmount, sanitizeAmountInput } from '../utils/money';
import { Dialog } from './Dialog';

type Props = {
  transaction: Transaction | null;
  categories: Category[];
  month: string;
  onClose: () => void;
  onSave: (input: TransactionInput, id: string | null) => void;
  onDelete: (() => void) | null;
};

type Draft = {
  type: TransactionType;
  amount: string;
  categoryId: string;
  date: string;
  note: string;
};

type Errors = Partial<Record<'amount' | 'categoryId' | 'date' | 'note', string>>;

function firstCategory(categories: Category[], type: TransactionType): string {
  return categories.find((category) => category.kind === type)?.id ?? '';
}

function toDraft(transaction: Transaction | null, categories: Category[], month: string): Draft {
  if (!transaction) {
    const type: TransactionType = 'expense';
    return {
      type,
      amount: '',
      categoryId: firstCategory(categories, type),
      date: defaultDateForMonth(month),
      note: '',
    };
  }
  const categoryMatches = categories.some(
    (category) => category.id === transaction.categoryId && category.kind === transaction.type,
  );
  return {
    type: transaction.type,
    amount: amountToInput(transaction.amount),
    categoryId: categoryMatches ? transaction.categoryId : '',
    date: transaction.date,
    note: transaction.note,
  };
}

export function TransactionForm({ transaction, categories, month, onClose, onSave, onDelete }: Props) {
  const amountRef = useRef<HTMLInputElement>(null);
  const amountId = useId();
  const categoryId = useId();
  const dateId = useId();
  const noteId = useId();
  const [draft, setDraft] = useState<Draft>(() => toDraft(transaction, categories, month));
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    amountRef.current?.focus();
  }, []);

  const options = useMemo(
    () => categories.filter((category) => category.kind === draft.type),
    [categories, draft.type],
  );

  function updateType(type: TransactionType) {
    setDraft((current) => ({
      ...current,
      type,
      categoryId: firstCategory(categories, type),
    }));
    setErrors((current) => ({ ...current, categoryId: undefined }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Errors = {};
    const amount = readAmount(draft.amount);
    if (!amount.ok) nextErrors.amount = amount.reason;
    const category = categories.find((item) => item.id === draft.categoryId && item.kind === draft.type);
    if (!category) nextErrors.categoryId = 'Choose a category.';
    if (!isRealDate(draft.date)) nextErrors.date = 'Choose a valid date.';
    if (draft.note.trim().length > 160) nextErrors.note = 'Keep the note to 160 characters or fewer.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !amount.ok) return;
    onSave(
      {
        type: draft.type,
        amount: amount.value,
        categoryId: draft.categoryId,
        date: draft.date,
        note: draft.note,
      },
      transaction?.id ?? null,
    );
  }

  return (
    <Dialog title={transaction ? 'Edit transaction' : 'Add transaction'} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <fieldset>
          <legend className="label">Type</legend>
          <div className="grid grid-cols-2 gap-1 rounded-full bg-[var(--surface-muted)] p-1">
            {(['expense', 'income'] as const).map((type) => (
              <button
                key={type}
                type="button"
                className="rounded-full px-3 py-2 text-sm font-semibold"
                aria-pressed={draft.type === type}
                style={
                  draft.type === type
                    ? { background: 'var(--surface)', color: 'var(--ink)', boxShadow: 'var(--shadow)' }
                    : { color: 'var(--muted)' }
                }
                onClick={() => updateType(type)}
              >
                {type === 'expense' ? 'Expense' : 'Income'}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-4">
          <label className="label" htmlFor={amountId}>
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted)]">$</span>
            <input
              ref={amountRef}
              id={amountId}
              className="field field-amount money"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? `${amountId}-error` : undefined}
              value={draft.amount}
              onChange={(event) => {
                setDraft((current) => ({ ...current, amount: sanitizeAmountInput(event.target.value) }));
                setErrors((current) => ({ ...current, amount: undefined }));
              }}
            />
          </div>
          {errors.amount ? (
            <p id={`${amountId}-error`} className="field-error" role="alert">
              {errors.amount}
            </p>
          ) : null}
        </div>

        <div className="mt-4">
          <label className="label" htmlFor={categoryId}>
            Category
          </label>
          <select
            id={categoryId}
            className="field select"
            value={draft.categoryId}
            aria-invalid={Boolean(errors.categoryId)}
            aria-describedby={errors.categoryId ? `${categoryId}-error` : undefined}
            onChange={(event) => {
              setDraft((current) => ({ ...current, categoryId: event.target.value }));
              setErrors((current) => ({ ...current, categoryId: undefined }));
            }}
          >
            <option value="">Choose a category</option>
            {options.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId ? (
            <p id={`${categoryId}-error`} className="field-error" role="alert">
              {errors.categoryId}
            </p>
          ) : null}
        </div>

        <div className="mt-4">
          <label className="label" htmlFor={dateId}>
            Date
          </label>
          <input
            id={dateId}
            type="date"
            className="field"
            value={draft.date}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? `${dateId}-error` : `${dateId}-hint`}
            onChange={(event) => {
              setDraft((current) => ({ ...current, date: event.target.value }));
              setErrors((current) => ({ ...current, date: undefined }));
            }}
          />
          {errors.date ? (
            <p id={`${dateId}-error`} className="field-error" role="alert">
              {errors.date}
            </p>
          ) : (
            <p id={`${dateId}-hint`} className="mt-1 text-xs text-[var(--faint)]">
              It will show in the month of this date.
            </p>
          )}
        </div>

        <div className="mt-4">
          <label className="label" htmlFor={noteId}>
            Note <span className="font-normal text-[var(--faint)]">(optional)</span>
          </label>
          <textarea
            id={noteId}
            className="field min-h-20 resize-y"
            maxLength={160}
            placeholder={draft.type === 'income' ? 'Paycheck, invoice, refund…' : 'Rent, groceries, transit…'}
            aria-invalid={Boolean(errors.note)}
            aria-describedby={errors.note ? `${noteId}-error` : undefined}
            value={draft.note}
            onChange={(event) => {
              setDraft((current) => ({ ...current, note: event.target.value }));
              setErrors((current) => ({ ...current, note: undefined }));
            }}
          />
          {errors.note ? (
            <p id={`${noteId}-error`} className="field-error" role="alert">
              {errors.note}
            </p>
          ) : draft.note.length >= 120 ? (
            <p className="mt-1 text-xs text-[var(--faint)]">{160 - draft.note.length} characters left</p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {onDelete ? (
            <button type="button" className="btn-quiet" onClick={onDelete}>
              Delete transaction
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {transaction ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
