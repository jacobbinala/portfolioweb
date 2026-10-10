export type TransactionType = 'income' | 'expense';

export type Category = {
  id: string;
  name: string;
  color: string;
  kind: TransactionType;
  builtIn: boolean;
};

export type CategoryInput = {
  name: string;
  color: string;
  kind: TransactionType;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  note: string;
  createdAt: string;
};

export type TransactionInput = {
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  note: string;
};

export type BudgetData = {
  version: 1;
  transactions: Transaction[];
  categories: Category[];
};

export type ViewId = 'dashboard' | 'transactions' | 'categories';

export type ActionResult = { ok: true } | { ok: false; reason: string };
