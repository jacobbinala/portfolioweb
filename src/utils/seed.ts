import type { Transaction, TransactionType } from '../types';
import { monthKey, startOfDay, toISODate } from './dates';

type SeedDraft = {
  day: number;
  type: TransactionType;
  amount: number;
  categoryId: string;
  note: string;
};

const HISTORY: SeedDraft[][] = [
  [
    { day: 1, type: 'income', amount: 5320, categoryId: 'cat-salary', note: 'Payroll — Northwind Studio' },
    { day: 1, type: 'expense', amount: 1850, categoryId: 'cat-housing', note: 'Rent — 418 Maple Street' },
    { day: 2, type: 'expense', amount: 94.16, categoryId: 'cat-other', note: 'Electric bill' },
    { day: 3, type: 'expense', amount: 48, categoryId: 'cat-other', note: 'Phone plan' },
    { day: 4, type: 'expense', amount: 67.42, categoryId: 'cat-food', note: 'Groceries at Green Market' },
    { day: 6, type: 'expense', amount: 15.99, categoryId: 'cat-entertainment', note: 'Streaming subscription' },
    { day: 8, type: 'expense', amount: 12.5, categoryId: 'cat-transport', note: 'Metro rides' },
    { day: 9, type: 'expense', amount: 38.75, categoryId: 'cat-food', note: "Team lunch at June's" },
    { day: 12, type: 'expense', amount: 128.4, categoryId: 'cat-shopping', note: 'Winter coat, marked down' },
    { day: 14, type: 'expense', amount: 81.18, categoryId: 'cat-food', note: 'Groceries' },
    { day: 15, type: 'expense', amount: 35, categoryId: 'cat-transport', note: 'Monthly transit pass' },
    { day: 17, type: 'expense', amount: 26.4, categoryId: 'cat-health', note: 'Pharmacy — allergy refill' },
    { day: 18, type: 'income', amount: 860, categoryId: 'cat-freelance', note: 'Packaging illustrations for Linden Cafe' },
    { day: 20, type: 'expense', amount: 54, categoryId: 'cat-entertainment', note: 'Tickets, late showing' },
    { day: 22, type: 'expense', amount: 44.9, categoryId: 'cat-food', note: 'Dinner out' },
    { day: 22, type: 'income', amount: 40, categoryId: 'cat-other-income', note: 'Interest, savings account' },
    { day: 24, type: 'expense', amount: 19.75, categoryId: 'cat-transport', note: 'Rideshare home' },
    { day: 27, type: 'expense', amount: 72.33, categoryId: 'cat-food', note: 'Groceries' },
    { day: 28, type: 'expense', amount: 22, categoryId: 'cat-health', note: 'Yoga drop-in' },
  ],
  [
    { day: 1, type: 'income', amount: 5480, categoryId: 'cat-salary', note: 'Payroll — Northwind Studio' },
    { day: 1, type: 'expense', amount: 1850, categoryId: 'cat-housing', note: 'Rent — 418 Maple Street' },
    { day: 2, type: 'expense', amount: 88.4, categoryId: 'cat-other', note: 'Electric bill' },
    { day: 3, type: 'expense', amount: 48, categoryId: 'cat-other', note: 'Phone plan' },
    { day: 5, type: 'expense', amount: 104.27, categoryId: 'cat-food', note: 'Groceries at Green Market' },
    { day: 6, type: 'expense', amount: 15.99, categoryId: 'cat-entertainment', note: 'Streaming subscription' },
    { day: 7, type: 'expense', amount: 35, categoryId: 'cat-transport', note: 'Monthly transit pass' },
    { day: 9, type: 'expense', amount: 160, categoryId: 'cat-health', note: 'Dental cleaning, copay' },
    { day: 11, type: 'income', amount: 420, categoryId: 'cat-freelance', note: 'Half-day brand workshop' },
    { day: 13, type: 'expense', amount: 29.5, categoryId: 'cat-food', note: 'Coffee before a client meeting' },
    { day: 16, type: 'expense', amount: 56.8, categoryId: 'cat-shopping', note: 'Kitchen towels and soap' },
    { day: 18, type: 'expense', amount: 91.64, categoryId: 'cat-food', note: 'Groceries' },
    { day: 19, type: 'expense', amount: 18.2, categoryId: 'cat-transport', note: 'Rideshare to the dentist' },
    { day: 21, type: 'expense', amount: 64, categoryId: 'cat-entertainment', note: 'Concert, standing room' },
    { day: 23, type: 'expense', amount: 47.15, categoryId: 'cat-food', note: 'Dinner with a friend' },
    { day: 25, type: 'income', amount: 18.62, categoryId: 'cat-other-income', note: 'Card reward, cashed out' },
    { day: 26, type: 'expense', amount: 83.4, categoryId: 'cat-food', note: 'Groceries' },
    { day: 28, type: 'expense', amount: 210, categoryId: 'cat-shopping', note: 'Running shoes' },
  ],
  [
    { day: 1, type: 'income', amount: 5480, categoryId: 'cat-salary', note: 'Payroll — Northwind Studio' },
    { day: 1, type: 'expense', amount: 1850, categoryId: 'cat-housing', note: 'Rent — 418 Maple Street' },
    { day: 2, type: 'expense', amount: 91.05, categoryId: 'cat-other', note: 'Electric bill' },
    { day: 3, type: 'expense', amount: 48, categoryId: 'cat-other', note: 'Phone plan' },
    { day: 4, type: 'expense', amount: 76.88, categoryId: 'cat-food', note: 'Groceries at Green Market' },
    { day: 5, type: 'expense', amount: 42.15, categoryId: 'cat-food', note: 'Takeout after a late night' },
    { day: 6, type: 'expense', amount: 15.99, categoryId: 'cat-entertainment', note: 'Streaming subscription' },
    { day: 7, type: 'expense', amount: 35, categoryId: 'cat-transport', note: 'Monthly transit pass' },
    { day: 8, type: 'expense', amount: 24.6, categoryId: 'cat-health', note: 'Pharmacy' },
    { day: 8, type: 'expense', amount: 16.75, categoryId: 'cat-transport', note: 'Rideshare, heavy rain' },
    { day: 9, type: 'income', amount: 275, categoryId: 'cat-freelance', note: 'Logo revisions for Field Day' },
    { day: 9, type: 'expense', amount: 68, categoryId: 'cat-shopping', note: 'Notebooks and ink' },
    { day: 10, type: 'expense', amount: 18.4, categoryId: 'cat-food', note: 'Lunch near the studio' },
  ],
];

function dateOnOrBeforeToday(year: number, monthIndex: number, day: number, today: Date): string | null {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  if (day > lastDay) return null;
  const date = startOfDay(new Date(year, monthIndex, day));
  if (date > today) return null;
  return toISODate(date);
}

export function buildSeed(now = new Date()): Transaction[] {
  const today = startOfDay(now);
  const transactions: Transaction[] = [];

  HISTORY.forEach((monthDrafts, indexFromOldest) => {
    const offset = HISTORY.length - 1 - indexFromOldest;
    const cursor = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    const key = monthKey(cursor);
    monthDrafts.forEach((draft, index) => {
      const date = dateOnOrBeforeToday(cursor.getFullYear(), cursor.getMonth(), draft.day, today);
      if (!date) return;
      transactions.push({
        id: `seed-${key}-${index}`,
        type: draft.type,
        amount: draft.amount,
        categoryId: draft.categoryId,
        date,
        note: draft.note,
        createdAt: `${date}T12:00:00.${String(index).padStart(3, '0')}Z`,
      });
    });
  });

  return transactions;
}
