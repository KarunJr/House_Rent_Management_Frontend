import {
  adToBs,
  bsToAdIso,
  formatBs,
  parseBs,
  type BsDate,
} from '@inicrea/bikram-sambat-react-native';

import type { CalendarMode } from './date-preference.store';

/**
 * Canonical AD date format used throughout the application.
 *
 * The expected format is:
 *
 *     YYYY-MM-DD
 *
 * Example:
 *
 *     "2026-09-02"
 *
 * This regex validates the structure of the date string only.
 * It does not verify whether the month/day combination is a real
 * calendar date.
 *
 * Examples:
 *
 *     "2026-09-02" → matches
 *     "2026-9-2"   → does not match
 *     "09-02-2026" → does not match
 *     "hello"      → does not match
 */
const AD_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Formats an AD date string into the application's standard
 * `YYYY-MM-DD` representation.
 *
 * The date is interpreted at midnight UTC so that timezone
 * differences do not change the calendar day during formatting.
 *
 * @param adDate - An AD date string, normally in `YYYY-MM-DD` format.
 *
 * @returns The formatted AD date in `YYYY-MM-DD` format.
 * If the input cannot be parsed as a JavaScript date, the original
 * input is returned unchanged.
 *
 * @example
 * ```ts
 * formatAdDate('2026-09-02');
 * // "2026-09-02"
 * ```
 *
 * @example
 * ```ts
 * formatAdDate('invalid-date');
 * // "invalid-date"
 * ```
 *
 * @remarks
 * This function is intended for formatting/displaying AD dates.
 * It does not convert between AD and BS.
 */
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

/**
 * Checks whether a value follows the application's canonical
 * AD date string format: `YYYY-MM-DD`.
 *
 * @param value - The string to validate.
 *
 * @returns `true` when the value matches `YYYY-MM-DD`; otherwise `false`.
 *
 * @example
 * ```ts
 * isCanonicalAdDate('2026-09-02');
 * // true
 * ```
 *
 * @example
 * ```ts
 * isCanonicalAdDate('2026-9-2');
 * // false
 *
 * isCanonicalAdDate('09/02/2026');
 * // false
 * ```
 *
 * @remarks
 * This function validates the string's structure only.
 *
 * For example:
 *
 * ```ts
 * isCanonicalAdDate('2026-99-99');
 * // true
 * ```
 *
 * The result is `true` because the string has the correct
 * `YYYY-MM-DD` structure. This function does not perform full
 * calendar-date validation.
 */
export const isCanonicalAdDate = (value: string) => AD_DATE_PATTERN.test(value);

// Date-only values use local parts so Nepal's UTC offset cannot shift a day.

/**
 * Converts a canonical AD date string into a native JavaScript `Date`.
 *
 * The input is expected to use the application's canonical
 * `YYYY-MM-DD` format.
 *
 * @param adDate - Canonical AD date string in `YYYY-MM-DD` format.
 *
 * @returns A JavaScript `Date` created from the local year, month,
 * and day components, or `null` when the input does not match the
 * canonical AD date format or cannot be represented as a valid date.
 *
 * @example
 * ```ts
 * dateFromCanonical('2026-09-02');
 * // Date representing September 2, 2026
 * ```
 *
 * @example
 * ```ts
 * dateFromCanonical('09/02/2026');
 * // null
 * ```
 *
 * @remarks
 * JavaScript's `Date` constructor uses zero-based month indexes:
 *
 *     January  = 0
 *     February = 1
 *     ...
 *     December = 11
 *
 * Therefore the canonical month is reduced by one before creating
 * the `Date`.
 *
 * This function intentionally uses local date parts rather than
 * parsing a UTC timestamp. This prevents a date-only value from
 * being shifted to another calendar day because of timezone offsets.
 */
export const dateFromCanonical = (adDate: string) => {
  if (!isCanonicalAdDate(adDate)) return null;

  const [year, month, day] = adDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Converts a native JavaScript `Date` into the application's
 * canonical AD date string.
 *
 * The resulting format is always:
 *
 *     YYYY-MM-DD
 *
 * @param date - JavaScript `Date` instance to convert.
 *
 * @returns The date represented as a canonical AD string.
 *
 * @example
 * ```ts
 * const date = new Date(2026, 8, 2);
 *
 * canonicalDateFromDate(date);
 * // "2026-09-02"
 * ```
 *
 * @remarks
 * JavaScript months are zero-based, so `getMonth()` returns `8`
 * for September. This function adds `1` before formatting the month.
 *
 * `padStart(2, '0')` ensures that single-digit months and days are
 * represented with two digits.
 *
 * Example:
 *
 *     2026-9-2
 *
 * becomes:
 *
 *     2026-09-02
 */
export const canonicalDateFromDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Converts a canonical AD date into the value expected by the
 * calendar picker based on the selected calendar mode.
 *
 * The application keeps AD `YYYY-MM-DD` as its canonical date format.
 * When the picker is in AD mode, the canonical value is returned
 * unchanged. When the picker is in BS mode, the AD date is converted
 * to BS and formatted as `YYYY-MM-DD`.
 *
 * @param adDate - Canonical AD date string in `YYYY-MM-DD` format.
 * @param mode - Calendar mode, either AD or BS.
 *
 * @returns The date string that should be supplied to the picker.
 * Returns an empty string when no date is provided or when BS
 * conversion fails.
 *
 * @example
 * ```ts
 * pickerValueFromCanonicalDate('2026-09-02', 'AD');
 * // "2026-09-02"
 * ```
 *
 * @example
 * ```ts
 * pickerValueFromCanonicalDate('2026-09-02', 'BS');
 * // "2083-05-17" (BS equivalent)
 * ```
 *
 * @remarks
 * This function performs two operations when the mode is BS:
 *
 *     AD string
 *        ↓
 *     adToBs()
 *        ↓
 *     BsDate
 *        ↓
 *     formatBs()
 *        ↓
 *     BS YYYY-MM-DD string
 *
 * The function is intended for the boundary between the application's
 * canonical AD value and the date picker's displayed/selected value.
 */
export const pickerValueFromCanonicalDate = (adDate: string, mode: CalendarMode) => {
  if (!adDate) return '';
  if (mode === 'AD') return adDate;

  try {
    return formatBs(adToBs(adDate), 'YYYY-MM-DD');
  } catch {
    return '';
  }
};

/**
 * Converts a value returned by the date picker into the application's
 * canonical AD date.
 *
 * The canonical value used by the application is always an AD
 * `YYYY-MM-DD` string, regardless of whether the user is interacting
 * with the picker in AD or BS mode.
 *
 * @param params - Picker conversion parameters.
 * @param params.value - The value returned by the picker.
 * @param params.mode - Current calendar mode, either AD or BS.
 * @param params.adFromDetail - Optional AD date supplied by the picker
 * alongside the selected BS date. When available, this value is used
 * directly because it is already the canonical AD representation.
 *
 * @returns The canonical AD date string.
 *
 * @example
 * ```ts
 * canonicalDateFromPicker({
 *   value: '2026-09-02',
 *   mode: 'AD',
 * });
 * // "2026-09-02"
 * ```
 *
 * @example
 * ```ts
 * canonicalDateFromPicker({
 *   value: '2083-05-17',
 *   mode: 'BS',
 * });
 * // "2026-09-02"
 * ```
 *
 * @example
 * ```ts
 * canonicalDateFromPicker({
 *   value: '2083-05-17',
 *   mode: 'BS',
 *   adFromDetail: '2026-09-02',
 * });
 * // "2026-09-02"
 * ```
 *
 * @remarks
 * When `adFromDetail` is provided, it takes priority over manually
 * parsing and converting the BS value.
 *
 * If `adFromDetail` is not available and the mode is BS, the function:
 *
 *     BS string
 *        ↓
 *     parseBs()
 *        ↓
 *     BsDate
 *        ↓
 *     bsToAdIso()
 *        ↓
 *     canonical AD string
 *
 * If BS parsing fails, the original `value` is returned.
 */
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

/**
 * Converts a canonical AD date into a Bikram Sambat date object.
 *
 * This is a small convenience wrapper around the library's `adToBs`
 * conversion function and safely handles empty or invalid input.
 *
 * @param adDate - Canonical AD date string in `YYYY-MM-DD` format.
 *
 * @returns A `BsDate` object containing the BS year, month, and day,
 * or `null` when the input is empty or conversion fails.
 *
 * @example
 * ```ts
 * const bsDate = bsDateFromCanonical('2026-09-02');
 *
 * // bsDate is a BsDate object, for example:
 * // {
 * //   year: 2083,
 * //   month: 5,
 * //   day: 17
 * // }
 * ```
 *
 * @example
 * ```ts
 * bsDateFromCanonical('');
 * // null
 * ```
 *
 * @remarks
 * This function performs calendar conversion only.
 * It does not format the resulting BS date into a string.
 *
 * Use `formatBs()` when a formatted BS string is required.
 */
export const bsDateFromCanonical = (adDate: string): BsDate | null => {
  if (!adDate) return null;

  try {
    return adToBs(adDate);
  } catch {
    return null;
  }
};

/**
 * Formats a canonical AD date according to the selected calendar mode.
 *
 * When the mode is AD, the date is formatted as an AD `YYYY-MM-DD`
 * string. When the mode is BS, the AD date is converted to BS and
 * displayed in a human-readable format.
 *
 * @param adDate - Canonical AD date string in `YYYY-MM-DD` format.
 * @param mode - Calendar mode, either AD or BS.
 *
 * @returns A formatted date string for the requested calendar mode.
 * Returns an empty string when no date is provided or when BS
 * conversion fails.
 *
 * @example
 * ```ts
 * formatCanonicalDateForMode('2026-09-02', 'AD');
 * // "2026-09-02"
 * ```
 *
 * @example
 * ```ts
 * formatCanonicalDateForMode('2026-09-02', 'BS');
 * // "2083 Bhadra 17" (BS equivalent)
 * ```
 *
 * @remarks
 * Unlike `pickerValueFromCanonicalDate()`, this function uses the
 * human-readable BS format:
 *
 *     YYYY MMMM DD
 *
 * For example:
 *
 *     2083 Bhadra 17
 *
 * This function is therefore more suitable for displaying dates in
 * labels, summaries, details, cards, and other user-facing UI.
 */
export const formatCanonicalDateForMode = (adDate: string, mode: CalendarMode) => {
  if (!adDate) return '';
  if (mode === 'AD') return formatAdDate(adDate);

  const bsDate = bsDateFromCanonical(adDate);
  return bsDate ? formatBs(bsDate, 'YYYY MMMM DD', { locale: 'en' }) : '';
};

/**
 * Returns both the AD and BS representations of a canonical date.
 *
 * The input is always treated as the canonical AD date and is converted
 * to BS internally.
 *
 * @param adDate - Canonical AD date string in `YYYY-MM-DD` format.
 *
 * @returns An object containing both formatted AD and BS representations:
 *
 *     {
 *       ad: string;
 *       bs: string;
 *     }
 *
 * If no date is supplied, both values are empty strings.
 * If BS conversion fails, the `bs` value is an empty string while
 * the AD value is still returned.
 *
 * @example
 * ```ts
 * formatCanonicalDateSummary('2026-09-02');
 *
 * // {
 * //   ad: '2026-09-02',
 * //   bs: '2083 Bhadra 17'
 * // }
 * ```
 *
 * @remarks
 * This function is useful when the UI needs to display both calendars
 * at the same time, regardless of the user's selected calendar mode.
 *
 * Example UI:
 *
 *     2026-09-02
 *     2083 Bhadra 17
 */
export const formatCanonicalDateSummary = (adDate: string) => {
  if (!adDate) {
    return { ad: '', bs: '' };
  }

  const bsDate = bsDateFromCanonical(adDate);
  return {
    ad: formatAdDate(adDate),
    bs: bsDate ? formatBs(bsDate, 'YYYY MMMM DD', { locale: 'en' }) : '',
  };
};

/**
 * Converts a canonical AD date into a UTC ISO 8601 timestamp.
 *
 * The canonical date is interpreted as midnight UTC.
 *
 * @param adDate - Canonical AD date string in `YYYY-MM-DD` format.
 *
 * @returns An ISO 8601 UTC timestamp, or an empty string when no date
 * is provided.
 *
 * @example
 * ```ts
 * canonicalDateToUtcIso('2026-09-02');
 * // "2026-09-02T00:00:00.000Z"
 * ```
 *
 * @remarks
 * This function changes a date-only value into a full timestamp.
 *
 * Canonical date:
 *
 *     "2026-09-02"
 *
 * becomes:
 *
 *     "2026-09-02T00:00:00.000Z"
 *
 * The `Z` indicates UTC.
 *
 * This is useful when an API or backend expects a full ISO timestamp
 * rather than a date-only `YYYY-MM-DD` value.
 */
export const canonicalDateToUtcIso = (adDate: string) => {
  if (!adDate) return '';
  return new Date(`${adDate}T00:00:00.000Z`).toISOString();
};
