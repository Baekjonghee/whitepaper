import { VERSES, type Verse } from '@/lib/verses';

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export function getSeoulDateKey(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value ?? '1970';
  const month = parts.find((part) => part.type === 'month')?.value ?? '01';
  const day = parts.find((part) => part.type === 'day')?.value ?? '01';

  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00+09:00`);
}

export function isValidDateKey(dateKey: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return false;
  }

  const date = parseDateKey(dateKey);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return getSeoulDateKey(date) === dateKey;
}

function hashString(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

export function getTodayDateKey(date: Date = new Date()): string {
  return getSeoulDateKey(date);
}

export function getVerseForDateKey(dateKey: string): Verse {
  const verseIndex = hashString(dateKey) % VERSES.length;
  return VERSES[verseIndex]!;
}

export function formatDateKey(dateKey: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(parseDateKey(dateKey));
}

export function getPastVerseSummaries(days: number = 7) {
  const todayKey = getTodayDateKey();
  const todayDate = parseDateKey(todayKey);

  return Array.from({ length: days }, (_, index) => {
    const targetDate = new Date(todayDate.getTime() - (index + 1) * ONE_DAY_MS);
    const dateKey = getSeoulDateKey(targetDate);

    return {
      dateKey,
      dateLabel: formatDateKey(dateKey),
      verse: getVerseForDateKey(dateKey),
    };
  });
}
