import {
  adToBs,
  bsToAdIso,
  formatBs,
  parseBs,
  type BsDate,
} from '@inicrea/bikram-sambat-react-native';

import type { CalendarMode } from './date-preference.store';

const AD_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const formatAdDate = (adDate: string) => {
  const parsed = new Date(`${adDate}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    return adDate;
  }

  return parsed.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  });
};

export const isCanonicalAdDate = (value: string) => AD_DATE_PATTERN.test(value);

export const pickerValueFromCanonicalDate = (adDate: string, mode: CalendarMode) => {
  if (!adDate) return '';
  if (mode === 'AD') return adDate;

  try {
    return formatBs(adToBs(adDate), 'YYYY-MM-DD');
  } catch {
    return '';
  }
};

export const canonicalDateFromPicker = ({
  value,
  mode,
  adFromDetail,
}: {
  value: string;
  mode: CalendarMode;
  adFromDetail?: string;
}) => {
  if (mode === 'AD') {
    return value;
  }

  if (adFromDetail) {
    return adFromDetail;
  }

  const parsed = parseBs(value, 'YYYY-MM-DD');
  return parsed ? bsToAdIso(parsed) : value;
};

export const bsDateFromCanonical = (adDate: string): BsDate | null => {
  if (!adDate) return null;

  try {
    return adToBs(adDate);
  } catch {
    return null;
  }
};

export const formatCanonicalDateForMode = (adDate: string, mode: CalendarMode) => {
  if (!adDate) return '';
  if (mode === 'AD') return formatAdDate(adDate);

  const bsDate = bsDateFromCanonical(adDate);
  return bsDate ? formatBs(bsDate, 'YYYY MMMM DD', { locale: 'ne' }) : '';
};

export const formatCanonicalDateSummary = (adDate: string) => {
  if (!adDate) {
    return { ad: '', bs: '' };
  }

  const bsDate = bsDateFromCanonical(adDate);
  return {
    ad: formatAdDate(adDate),
    bs: bsDate ? formatBs(bsDate, 'YYYY MMMM DD', { locale: 'ne' }) : '',
  };
};

export const canonicalDateToUtcIso = (adDate: string) => {
  if (!adDate) return '';
  return new Date(`${adDate}T00:00:00.000Z`).toISOString();
};
