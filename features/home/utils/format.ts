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
