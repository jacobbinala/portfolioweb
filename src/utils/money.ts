const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatMoney(amount: number): string {
  return currency.format(roundMoney(amount));
}

export function formatSigned(amount: number, sign: 'plus' | 'minus'): string {
  return `${sign === 'plus' ? '+' : '−'}${formatMoney(Math.abs(amount))}`;
}

export function formatAxis(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1000) {
    const compact = abs / 1000;
    const digits = compact >= 10 || Number.isInteger(Number(compact.toFixed(1))) ? 0 : 1;
    return `$${compact.toFixed(digits)}k`;
  }
  return `$${Math.round(abs)}`;
}

export function formatShare(share: number): string {
  const percent = share * 100;
  if (percent > 0 && percent < 1) return '<1%';
  return `${Math.round(percent)}%`;
}

export function sanitizeAmountInput(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, '');
  const dot = cleaned.indexOf('.');
  if (dot === -1) return cleaned.slice(0, 7);
  const whole = cleaned.slice(0, dot).slice(0, 7);
  const fraction = cleaned.slice(dot + 1).replace(/\./g, '').slice(0, 2);
  return `${whole}.${fraction}`;
}

export function readAmount(raw: string): { ok: true; value: number } | { ok: false; reason: string } {
  const trimmed = raw.trim().replace(/[$,]/g, '');
  if (!trimmed) return { ok: false, reason: 'Enter an amount.' };
  const normalized = trimmed.startsWith('.') ? `0${trimmed}` : trimmed;
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) {
    return { ok: false, reason: 'Use dollars and cents, like 42.50.' };
  }
  const value = roundMoney(Number(normalized));
  if (value <= 0) return { ok: false, reason: 'Enter an amount greater than zero.' };
  if (value > 1_000_000) return { ok: false, reason: 'Enter an amount of $1,000,000 or less.' };
  return { ok: true, value };
}

export function amountToInput(amount: number): string {
  return roundMoney(amount).toFixed(2);
}
