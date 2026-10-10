import type { Transaction } from '../types';

export function compareTransactions(a: Transaction, b: Transaction): number {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
  return a.id < b.id ? 1 : -1;
}

export function groupByDate(transactions: readonly Transaction[]): { date: string; items: Transaction[] }[] {
  const sorted = [...transactions].sort(compareTransactions);
  const groups: { date: string; items: Transaction[] }[] = [];
  for (const transaction of sorted) {
    const last = groups[groups.length - 1];
    if (last && last.date === transaction.date) last.items.push(transaction);
    else groups.push({ date: transaction.date, items: [transaction] });
  }
  return groups;
}

export function matchesQuery(transaction: Transaction, categoryName: string, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [transaction.note, categoryName, transaction.date, transaction.amount.toFixed(2)]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}
