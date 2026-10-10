import { LayoutDashboard, Moon, Plus, Sun, Tags, Wallet } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { Transaction, ViewId } from '../types';
import { useBudget } from '../hooks/useBudget';
import { useTheme } from '../hooks/useTheme';
import { formatDate, formatMonth, monthKey } from '../utils/dates';
import { formatMoney } from '../utils/money';
import { Brand } from './Brand';
import { CategoriesView } from './CategoriesView';
import { ConfirmDialog } from './ConfirmDialog';
import { Dashboard } from './Dashboard';
import { MonthSwitcher } from './MonthSwitcher';
import { Toast } from './Toast';
import { TransactionForm } from './TransactionForm';
import { TransactionsView } from './TransactionsView';

const NAV: { id: ViewId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Wallet },
  { id: 'categories', label: 'Categories', icon: Tags },
];

type Editor =
  | { mode: 'create' }
  | { mode: 'edit'; transaction: Transaction }
  | null;

export function Shell() {
  const budget = useBudget();
  const { theme, toggleTheme } = useTheme();
  const [month, setMonth] = useState(() => monthKey(new Date()));
  const [view, setView] = useState<ViewId>('dashboard');
  const [editor, setEditor] = useState<Editor>(null);
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [focusData, setFocusData] = useState(false);

  const notify = useCallback((message: string) => setToast(message), []);
  const clearFocus = useCallback(() => setFocusData(false), []);

  useEffect(() => {
    document.title = `Harbor · ${formatMonth(month)}`;
  }, [month]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function openCreate() {
    setEditor({ mode: 'create' });
  }

  function saveTransaction(
    input: { type: Transaction['type']; amount: number; categoryId: string; date: string; note: string },
    id: string | null,
  ) {
    if (id) budget.updateTransaction(id, input);
    else budget.addTransaction(input);
    const target = input.date.slice(0, 7);
    if (target !== month) notify(`Saved to ${formatMonth(target)}.`);
    else notify(id ? 'Transaction updated.' : 'Transaction added.');
    setEditor(null);
  }

  const deleteTarget = pendingDelete;
  const deleteCategory = budget.data.categories.find((category) => category.id === deleteTarget?.categoryId);

  return (
    <div className="min-h-dvh">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-full focus:bg-[var(--surface)] focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto grid max-w-[1200px] md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-dvh flex-col border-r border-[var(--line)] px-4 py-6 md:flex">
          <Brand />
          <nav className="mt-8 space-y-1" aria-label="Primary">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className="nav-item"
                  aria-current={view === item.id ? 'page' : undefined}
                  onClick={() => setView(item.id)}
                >
                  <Icon size={18} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto space-y-3 pt-6">
            <p className="px-2 text-sm text-[var(--muted)]">Your data stays in this browser.</p>
            <button
              type="button"
              className="btn-quiet"
              onClick={() => {
                setView('categories');
                setFocusData(true);
              }}
            >
              Manage data
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] backdrop-blur-md">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-3 md:px-8">
              <div className="md:hidden">
                <Brand compact />
              </div>
              <div className="col-span-2 md:col-span-1 md:col-start-1">
                <MonthSwitcher month={month} onChange={setMonth} />
              </div>
              <div className="col-start-2 row-start-1 flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                </button>
                <button type="button" className="btn btn-primary" onClick={openCreate}>
                  <Plus size={18} aria-hidden="true" />
                  <span className="hidden sm:inline">Add transaction</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          </header>

          <main id="content" tabIndex={-1} className="px-4 py-6 pb-28 outline-none md:px-8 md:pb-16">
            {view === 'dashboard' ? (
              <Dashboard
                month={month}
                onAdd={openCreate}
                onEdit={(transaction) => setEditor({ mode: 'edit', transaction })}
                onDelete={setPendingDelete}
                onViewAll={() => setView('transactions')}
              />
            ) : null}
            {view === 'transactions' ? (
              <TransactionsView
                month={month}
                onAdd={openCreate}
                onEdit={(transaction) => setEditor({ mode: 'edit', transaction })}
                onDelete={setPendingDelete}
              />
            ) : null}
            {view === 'categories' ? (
              <CategoriesView
                month={month}
                monthLabel={formatMonth(month)}
                notify={notify}
                focusData={focusData}
                onFocusHandled={clearFocus}
                onSampleRestored={() => {
                  setMonth(monthKey(new Date()));
                  setView('dashboard');
                }}
                onCleared={() => setView('dashboard')}
              />
            ) : null}
          </main>
        </div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-[var(--surface)] md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Primary"
      >
        <div className="grid grid-cols-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className="flex flex-col items-center gap-1 py-2 text-xs font-semibold"
                style={{ color: active ? 'var(--accent)' : 'var(--muted)' }}
                aria-current={active ? 'page' : undefined}
                onClick={() => setView(item.id)}
              >
                <Icon size={20} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {editor ? (
        <TransactionForm
          transaction={editor.mode === 'edit' ? editor.transaction : null}
          categories={budget.data.categories}
          month={month}
          onClose={() => setEditor(null)}
          onSave={saveTransaction}
          onDelete={
            editor.mode === 'edit'
              ? () => {
                  const transaction = editor.transaction;
                  setEditor(null);
                  setPendingDelete(transaction);
                }
              : null
          }
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          title="Delete transaction"
          body={`Remove the ${deleteCategory?.name ?? 'uncategorized'} ${deleteTarget.type} of ${formatMoney(deleteTarget.amount)} on ${formatDate(deleteTarget.date)}? This only affects this browser.`}
          confirmLabel="Delete"
          onClose={() => setPendingDelete(null)}
          onConfirm={() => {
            budget.deleteTransaction(deleteTarget.id);
            setPendingDelete(null);
            notify('Transaction deleted.');
          }}
        />
      ) : null}

      <Toast message={toast} />
    </div>
  );
}
