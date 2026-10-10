export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function monthKey(date: Date): string {
  return toISODate(date).slice(0, 7);
}

export function parseMonth(key: string): { year: number; monthIndex: number } {
  const match = /^(\d{4})-(\d{2})$/.exec(key);
  if (!match) return { year: 1970, monthIndex: 0 };
  return { year: Number(match[1]), monthIndex: Number(match[2]) - 1 };
}

export function shiftMonth(key: string, delta: number): string {
  const { year, monthIndex } = parseMonth(key);
  return monthKey(new Date(year, monthIndex + delta, 1));
}

export function isInMonth(isoDate: string, key: string): boolean {
  return isoDate.slice(0, 7) === key;
}

export function isRealDate(iso: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function formatMonth(key: string, style: 'long' | 'short' = 'long'): string {
  const { year, monthIndex } = parseMonth(key);
  return new Date(year, monthIndex, 1).toLocaleDateString('en-US', {
    month: style,
    year: 'numeric',
  });
}

export function shortMonth(key: string, relativeTo: string): string {
  const { year, monthIndex } = parseMonth(key);
  const sameYear = year === parseMonth(relativeTo).year;
  return new Date(year, monthIndex, 1).toLocaleDateString(
    'en-US',
    sameYear ? { month: 'short' } : { month: 'short', year: 'numeric' },
  );
}

export function chartMonthLabel(key: string, keys: readonly string[]): string {
  const { year, monthIndex } = parseMonth(key);
  const month = new Date(year, monthIndex, 1).toLocaleDateString('en-US', { month: 'short' });
  const years = new Set(keys.map((item) => parseMonth(item).year));
  if (years.size > 1) return `${month} '${String(year).slice(2)}`;
  return month;
}

export function lastMonths(endKey: string, count: number): string[] {
  const keys: string[] = [];
  for (let index = count - 1; index >= 0; index -= 1) {
    keys.push(shiftMonth(endKey, -index));
  }
  return keys;
}

export function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatGroupDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function defaultDateForMonth(month: string, now = new Date()): string {
  const today = toISODate(now);
  const todayKey = today.slice(0, 7);
  if (month === todayKey) return today;
  const { year, monthIndex } = parseMonth(month);
  if (month > todayKey) return toISODate(new Date(year, monthIndex, 1));
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return toISODate(new Date(year, monthIndex, Math.min(now.getDate(), lastDay)));
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
