import type { Category } from '../types';

export const SWATCHES = [
  '#0f5e58',
  '#2f7d4a',
  '#3b6fd8',
  '#0e7490',
  '#7c5cbf',
  '#c43b6e',
  '#c4624a',
  '#c4842a',
  '#a16207',
  '#6f675e',
] as const;

export const UNCATEGORIZED_COLOR = '#6f675e';

export function defaultCategories(): Category[] {
  return [
    { id: 'cat-housing', name: 'Housing', color: '#c4624a', kind: 'expense', builtIn: true },
    { id: 'cat-food', name: 'Food', color: '#2f7d4a', kind: 'expense', builtIn: true },
    { id: 'cat-transport', name: 'Transport', color: '#3b6fd8', kind: 'expense', builtIn: true },
    { id: 'cat-entertainment', name: 'Entertainment', color: '#7c5cbf', kind: 'expense', builtIn: true },
    { id: 'cat-health', name: 'Health', color: '#c43b6e', kind: 'expense', builtIn: true },
    { id: 'cat-shopping', name: 'Shopping', color: '#c4842a', kind: 'expense', builtIn: true },
    { id: 'cat-other', name: 'Other', color: '#6f675e', kind: 'expense', builtIn: true },
    { id: 'cat-salary', name: 'Salary', color: '#0f5e58', kind: 'income', builtIn: true },
    { id: 'cat-freelance', name: 'Freelance', color: '#0e7490', kind: 'income', builtIn: true },
    { id: 'cat-other-income', name: 'Other income', color: '#a16207', kind: 'income', builtIn: true },
  ];
}
