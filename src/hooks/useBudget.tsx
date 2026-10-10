import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ActionResult, BudgetData, CategoryInput, TransactionInput } from '../types';
import { categoryError, cleanCategoryInput, deleteCategoryError } from '../utils/categories';
import { roundMoney } from '../utils/money';
import { createId, createSampleBudget, loadBudget, saveBudget } from '../utils/storage';

type BudgetContextValue = {
  data: BudgetData;
  addTransaction: (input: TransactionInput) => void;
  updateTransaction: (id: string, input: TransactionInput) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (input: CategoryInput) => ActionResult;
  updateCategory: (id: string, input: CategoryInput) => ActionResult;
  deleteCategory: (id: string) => ActionResult;
  resetSample: () => void;
  clearTransactions: () => void;
};

const BudgetContext = createContext<BudgetContextValue | null>(null);

function cleanTransaction(input: TransactionInput): TransactionInput {
  return {
    ...input,
    amount: roundMoney(input.amount),
    note: input.note.trim().slice(0, 160),
  };
}

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BudgetData>(() => loadBudget());
  const skipSave = useRef(true);

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    saveBudget(data);
  }, [data]);

  const addTransaction = useCallback((input: TransactionInput) => {
    const transaction = {
      ...cleanTransaction(input),
      id: createId('txn'),
      createdAt: new Date().toISOString(),
    };
    setData((current) => ({ ...current, transactions: [transaction, ...current.transactions] }));
  }, []);

  const updateTransaction = useCallback((id: string, input: TransactionInput) => {
    const next = cleanTransaction(input);
    setData((current) => ({
      ...current,
      transactions: current.transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...next } : transaction,
      ),
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      transactions: current.transactions.filter((transaction) => transaction.id !== id),
    }));
  }, []);

  const addCategory = useCallback(
    (input: CategoryInput): ActionResult => {
      const cleaned = cleanCategoryInput(input);
      const reason = categoryError(cleaned, data.categories);
      if (reason) return { ok: false, reason };
      setData((current) => ({
        ...current,
        categories: [
          ...current.categories,
          { ...cleaned, id: createId('cat'), builtIn: false },
        ],
      }));
      return { ok: true };
    },
    [data.categories],
  );

  const updateCategory = useCallback(
    (id: string, input: CategoryInput): ActionResult => {
      const existing = data.categories.find((category) => category.id === id);
      if (!existing) return { ok: false, reason: 'That category is no longer here.' };
      if (existing.builtIn) return { ok: false, reason: 'Default categories stay as they are.' };
      const cleaned = cleanCategoryInput(input);
      const reason = categoryError({ ...cleaned, kind: existing.kind }, data.categories, id);
      if (reason) return { ok: false, reason };
      setData((current) => ({
        ...current,
        categories: current.categories.map((category) =>
          category.id === id ? { ...category, name: cleaned.name, color: cleaned.color } : category,
        ),
      }));
      return { ok: true };
    },
    [data.categories],
  );

  const deleteCategory = useCallback(
    (id: string): ActionResult => {
      const existing = data.categories.find((category) => category.id === id);
      if (!existing) return { ok: false, reason: 'That category is no longer here.' };
      const reason = deleteCategoryError(existing, data.transactions);
      if (reason) return { ok: false, reason };
      setData((current) => ({
        ...current,
        categories: current.categories.filter((category) => category.id !== id),
      }));
      return { ok: true };
    },
    [data.categories, data.transactions],
  );

  const resetSample = useCallback(() => {
    setData(createSampleBudget());
  }, []);

  const clearTransactions = useCallback(() => {
    setData((current) => ({ ...current, transactions: [] }));
  }, []);

  const value = useMemo<BudgetContextValue>(
    () => ({
      data,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      resetSample,
      clearTransactions,
    }),
    [
      data,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      resetSample,
      clearTransactions,
    ],
  );

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudget(): BudgetContextValue {
  const value = useContext(BudgetContext);
  if (!value) throw new Error('useBudget must be used within BudgetProvider');
  return value;
}
