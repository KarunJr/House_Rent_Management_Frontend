export function formatCurrency(amount: number, currency = 'NPR'): string {
  // Lightweight formatter (avoids pulling in a full intl polyfill for RN).
  // Swap for Intl.NumberFormat if your target devices support it.
  const rounded = Math.round(amount).toLocaleString('en-IN');
  const symbol = currency === 'NPR' ? 'Rs.' : currency;
  return `${symbol} ${rounded}`;
}

export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

export function formatFloor(floor: string): string {
  const number = Number(floor);
  const lastTwo = number % 100;
  const suffix = lastTwo >= 11 && lastTwo <= 13
    ? 'th'
    : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[number % 10] ?? 'th';
  return `${number}${suffix} Floor`;
}
