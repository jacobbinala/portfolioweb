import { Pencil, Trash2 } from 'lucide-react';
import type { Category, Transaction } from '../types';
import { UNCATEGORIZED_COLOR } from '../utils/defaults';
import { formatDate } from '../utils/dates';
import { formatSigned } from '../utils/money';

type Props = {
  transaction: Transaction;
  category: Category | undefined;
  showDate?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function TransactionRow({ transaction, category, showDate = false, onEdit, onDelete }: Props) {
  const name = category?.name ?? 'Uncategorized';
  const color = category?.color ?? UNCATEGORIZED_COLOR;
  const signed = formatSigned(transaction.amount, transaction.type === 'income' ? 'plus' : 'minus');
  const label = `${transaction.type === 'income' ? 'Income' : 'Expense'} · ${name}`;

  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-1 h-10 w-1.5 shrink-0 rounded-full" style={{ background: color }} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate font-semibold">{name}</p>
          <p
            className="money shrink-0 font-semibold"
            style={{ color: transaction.type === 'income' ? 'var(--income)' : 'var(--expense)' }}
          >
            {signed}
          </p>
        </div>
        {transaction.note ? (
          <p className="truncate text-sm text-[var(--muted)]" title={transaction.note}>
            {transaction.note.replace(/\s+/g, ' ')}
          </p>
        ) : null}
        {showDate ? <p className="text-xs text-[var(--faint)]">{formatDate(transaction.date)}</p> : null}
      </div>
      <div className="flex shrink-0">
        <button type="button" className="icon-btn" aria-label={`Edit ${label} of ${signed}`} onClick={onEdit}>
          <Pencil size={16} aria-hidden="true" />
        </button>
        <button type="button" className="icon-btn" aria-label={`Delete ${label} of ${signed}`} onClick={onDelete}>
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
