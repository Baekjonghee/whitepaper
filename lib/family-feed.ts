import { APP_LAUNCH_DATE_KEY, getTodayDateKey } from '@/lib/daily-verse';

export const FAMILY_AUTHORS = [
  '아셀(첫째)',
  '이삭(둘째)',
  '조이(셋째)',
  '아빠',
  '엄마',
] as const;

export type FamilyAuthor = (typeof FAMILY_AUTHORS)[number];

export type FamilyFeedItem = {
  id: string;
  dateKey: string;
  author: FamilyAuthor;
  content: string;
  createdAt: string;
};

export const FAMILY_FEED_STORAGE_KEY = 'daily-bible-meditation:family-feed';
export const FAMILY_FEED_VERSION_KEY = 'daily-bible-meditation:family-feed-version';
export const FAMILY_FEED_RESET_VERSION = '2026-04-04-initial-reset';
export const FAMILY_FEED_MAX_LENGTH = 70;

type FamilyFeedStore = Record<string, FamilyFeedItem[]>;

function getEmptyStore(): FamilyFeedStore {
  return {};
}

function writeStore(store: FamilyFeedStore) {
  window.localStorage.setItem(FAMILY_FEED_STORAGE_KEY, JSON.stringify(store));
}

function normalizeStore(store: FamilyFeedStore): FamilyFeedStore {
  const todayDateKey = getTodayDateKey();
  const normalizedEntries = Object.entries(store).filter(([dateKey, items]) => {
    return (
      dateKey >= APP_LAUNCH_DATE_KEY &&
      dateKey <= todayDateKey &&
      Array.isArray(items)
    );
  });

  return Object.fromEntries(normalizedEntries);
}

function ensureResetVersion(): FamilyFeedStore | null {
  const version = window.localStorage.getItem(FAMILY_FEED_VERSION_KEY);

  if (version === FAMILY_FEED_RESET_VERSION) {
    return null;
  }

  const emptyStore = getEmptyStore();
  window.localStorage.setItem(FAMILY_FEED_VERSION_KEY, FAMILY_FEED_RESET_VERSION);
  writeStore(emptyStore);
  return emptyStore;
}

function readStore(): FamilyFeedStore {
  if (typeof window === 'undefined') {
    return {};
  }

  const resetStore = ensureResetVersion();

  if (resetStore) {
    return resetStore;
  }

  const raw = window.localStorage.getItem(FAMILY_FEED_STORAGE_KEY);

  if (!raw) {
    const emptyStore = getEmptyStore();
    writeStore(emptyStore);
    return emptyStore;
  }

  try {
    const parsed = JSON.parse(raw) as FamilyFeedStore;

    if (parsed && typeof parsed === 'object') {
      const normalizedStore = normalizeStore(parsed);

      if (JSON.stringify(parsed) !== JSON.stringify(normalizedStore)) {
        writeStore(normalizedStore);
      }

      return normalizedStore;
    }
  } catch {
    // ignore parse error and fall back to empty store
  }

  const emptyStore = getEmptyStore();
  writeStore(emptyStore);
  return emptyStore;
}

function createFeedId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function readFamilyFeedsByDate(dateKey: string): FamilyFeedItem[] {
  const store = readStore();
  return [...(store[dateKey] ?? [])].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

export function addFamilyFeedItem(input: {
  dateKey: string;
  author: FamilyAuthor;
  content: string;
}): FamilyFeedItem {
  const trimmedContent = input.content.trim();

  if (!input.author) {
    throw new Error('작성자를 선택해 주세요.');
  }

  if (!trimmedContent) {
    throw new Error('피드 내용을 입력해 주세요.');
  }

  if (trimmedContent.length > FAMILY_FEED_MAX_LENGTH) {
    throw new Error('피드는 70자 이하로 입력해 주세요.');
  }

  const store = readStore();
  const nextItem: FamilyFeedItem = {
    id: createFeedId(),
    dateKey: input.dateKey,
    author: input.author,
    content: trimmedContent,
    createdAt: new Date().toISOString(),
  };

  store[input.dateKey] = [nextItem, ...(store[input.dateKey] ?? [])];
  writeStore(store);

  return nextItem;
}

export function formatFamilyFeedTimestamp(createdAt: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(createdAt));
}
