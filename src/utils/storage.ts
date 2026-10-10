import type { BudgetData, Category, Transaction } from '../types';
import { defaultCategories } from './defaults';
import { isRealDate } from './dates';
import { roundMoney } from './money';
import { buildSeed } from './seed';

export const STORAGE_KEY = 'harbor.budget.v1';

function isTransaction(value: unknown): value is Transaction {
  if (!value || typeof value !== 'object') return false;
  const transaction = value as Transaction;
  return (
    typeof transaction.id === 'string' &&
    transaction.id.length > 0 &&
    (transaction.type === 'income' || transaction.type === 'expense') &&
    typeof transaction.amount === 'number' &&
    Number.isFinite(transaction.amount) &&
    transaction.amount > 0 &&
    transaction.amount <= 1_000_000 &&
    typeof transaction.categoryId === 'string' &&
    typeof transaction.date === 'string' &&
    isRealDate(transaction.date) &&
    typeof transaction.note === 'string' &&
    typeof transaction.createdAt === 'string'
  );
}

function isCustomCategory(value: unknown): value is Category {
  if (!value || typeof value !== 'object') return false;
  const category = value as Category;
  return (
    typeof category.id === 'string' &&
    category.id.length > 0 &&
    typeof category.name === 'string' &&
    category.name.trim().length > 0 &&
    category.name.trim().length <= 24 &&
    typeof category.color === 'string' &&
    /^#[0-9a-fA-F]{6}$/.test(category.color) &&
    (category.kind === 'income' || category.kind === 'expense') &&
    category.builtIn === false
  );
}

function mergeCategories(stored: unknown[]): Category[] {
  const defaults = defaultCategories();
  const defaultIds = new Set(defaults.map((category) => category.id));
  const seen = new Set<string>();
  const custom = stored.filter(isCustomCategory).filter((category) => {
    if (defaultIds.has(category.id) || seen.has(category.id)) return false;
    seen.add(category.id);
    return true;
  });
  return [...defaults, ...custom.map((category) => ({ ...category, name: category.name.trim() }))];
}

export function createSampleBudget(now = new Date()): BudgetData {
  return {
    version: 1,
    categories: defaultCategories(),
    transactions: buildSeed(now),
  };
}

export function validateBudget(value: unknown): BudgetData | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Partial<BudgetData>;
  if (record.version !== 1) return null;
  if (!Array.isArray(record.transactions) || !Array.isArray(record.categories)) return null;
  return {
    version: 1,
    categories: mergeCategories(record.categories),
    transactions: record.transactions.filter(isTransaction).map((transaction) => ({
      ...transaction,
      amount: roundMoney(transaction.amount),
      note: transaction.note.slice(0, 160),
    })),
  };
}

function writeBudget(data: BudgetData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* Ignore quota and private-mode failures. The session still works. */
  }
}

export function loadBudget(now = new Date()): BudgetData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const sample = createSampleBudget(now);
      writeBudget(sample);
      return sample;
    }
    const validated = validateBudget(JSON.parse(raw) as unknown);
    if (validated) return validated;
  } catch {
    /* Replace unreadable data with the sample set. */
  }
  const sample = createSampleBudget(now);
  writeBudget(sample);
  return sample;
}

export function saveBudget(data: BudgetData): void {
  writeBudget(data);
}

export function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
