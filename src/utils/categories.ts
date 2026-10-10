import type { Category, CategoryInput, Transaction } from '../types';

export function categoryError(
  input: CategoryInput,
  categories: readonly Category[],
  ignoreId?: string,
): string | null {
  const name = input.name.trim();
  if (name.length < 2) return 'Use at least 2 characters.';
  if (name.length > 24) return 'Keep the name to 24 characters or fewer.';
  if (!/^#[0-9a-fA-F]{6}$/.test(input.color)) return 'Choose a color.';
  const duplicate = categories.some(
    (category) =>
      category.id !== ignoreId &&
      category.kind === input.kind &&
      category.name.trim().toLowerCase() === name.toLowerCase(),
  );
  if (duplicate) {
    return `You already have an ${input.kind} category named ${name}.`;
  }
  return null;
}

export function deleteCategoryError(category: Category, transactions: readonly Transaction[]): string | null {
  if (category.builtIn) return 'Default categories stay in place.';
  const count = transactions.filter((transaction) => transaction.categoryId === category.id).length;
  if (count === 1) return 'One transaction still uses this category. Edit or delete it first.';
  if (count > 1) return `${count} transactions still use this category. Edit or delete them first.`;
  return null;
}

export function cleanCategoryInput(input: CategoryInput): CategoryInput {
  return {
    name: input.name.trim(),
    color: input.color.toLowerCase(),
    kind: input.kind,
  };
}
