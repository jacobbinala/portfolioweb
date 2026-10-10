import type { Category, Transaction } from '../types';
import { chartMonthLabel, formatMonth, isInMonth, lastMonths } from './dates';
import { formatMoney, roundMoney } from './money';

export type MonthTotals = {
  income: number;
  expenses: number;
  net: number;
  count: number;
};

export type SpendingSlice = {
  id: string;
  name: string;
  value: number;
  fill: string;
  share: number;
};

export type CashflowPoint = {
  key: string;
  label: string;
  fullLabel: string;
  income: number;
  expenses: number;
};

export function monthTotals(transactions: readonly Transaction[], month: string): MonthTotals {
  let income = 0;
  let expenses = 0;
  let count = 0;
  for (const transaction of transactions) {
    if (!isInMonth(transaction.date, month)) continue;
    count += 1;
    if (transaction.type === 'income') income += transaction.amount;
    else expenses += transaction.amount;
  }
  income = roundMoney(income);
  expenses = roundMoney(expenses);
  return { income, expenses, net: roundMoney(income - expenses), count };
}

export function monthNarrative(totals: MonthTotals, monthLabel: string): string {
  if (totals.count === 0) return `Nothing recorded for ${monthLabel} yet.`;
  if (totals.income === 0) {
    return `Spending so far is ${formatMoney(totals.expenses)}, with no income recorded.`;
  }
  if (totals.expenses === 0) {
    return `${formatMoney(totals.income)} came in, and nothing has been spent yet.`;
  }
  if (totals.net > 0) {
    const rate = Math.round((totals.net / totals.income) * 100);
    if (rate <= 0) return `You kept ${formatMoney(totals.net)}.`;
    return `You kept ${formatMoney(totals.net)} — ${rate}% of income.`;
  }
  if (totals.net < 0) {
    return `Spending ran ${formatMoney(Math.abs(totals.net))} ahead of income.`;
  }
  return 'Income and spending match for this month.';
}

export function spendingByCategory(
  transactions: readonly Transaction[],
  categories: readonly Category[],
  month: string,
): SpendingSlice[] {
  const totals = new Map<string, number>();
  for (const transaction of transactions) {
    if (transaction.type !== 'expense' || !isInMonth(transaction.date, month)) continue;
    totals.set(transaction.categoryId, (totals.get(transaction.categoryId) ?? 0) + transaction.amount);
  }
  const byId = new Map(categories.map((category) => [category.id, category]));
  const slices = [...totals.entries()]
    .map(([id, amount]) => {
      const category = byId.get(id);
      return {
        id,
        name: category?.name ?? 'Uncategorized',
        value: roundMoney(amount),
        fill: category?.color ?? '#6f675e',
      };
    })
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  return slices.map((slice) => ({
    ...slice,
    share: total > 0 ? slice.value / total : 0,
  }));
}

export function cashflowSeries(
  transactions: readonly Transaction[],
  endMonth: string,
  count = 6,
): CashflowPoint[] {
  const keys = lastMonths(endMonth, count);
  return keys.map((key) => {
    const totals = monthTotals(transactions, key);
    return {
      key,
      label: chartMonthLabel(key, keys),
      fullLabel: formatMonth(key),
      income: totals.income,
      expenses: totals.expenses,
    };
  });
}

export function deltaText(
  current: number,
  previous: number,
  comparisonLabel: string,
): { text: string; direction: 'up' | 'down' | 'flat' } | null {
  if (current === 0 && previous === 0) return null;
  const diff = roundMoney(current - previous);
  if (diff === 0) return { text: `Flat vs ${comparisonLabel}`, direction: 'flat' };
  const text = `${diff > 0 ? '+' : '−'}${formatMoney(Math.abs(diff))} vs ${comparisonLabel}`;
  return { text, direction: diff > 0 ? 'up' : 'down' };
}
