import { getSeoulDateKey, getTodayDateKey, parseDateKey } from '@/lib/daily-verse';

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
export const FAMILY_FEED_MAX_LENGTH = 70;

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

type FamilyFeedStore = Record<string, FamilyFeedItem[]>;

function buildSeedItem(
  dateKey: string,
  author: FamilyAuthor,
  content: string,
  hour: number,
  minute: number,
): FamilyFeedItem {
  const paddedHour = String(hour).padStart(2, '0');
  const paddedMinute = String(minute).padStart(2, '0');

  return {
    id: `seed-${dateKey}-${paddedHour}${paddedMinute}-${author}`,
    dateKey,
    author,
    content,
    createdAt: new Date(`${dateKey}T${paddedHour}:${paddedMinute}:00+09:00`).toISOString(),
  };
}

function getSeedStore(): FamilyFeedStore {
  const todayKey = getTodayDateKey();
  const baseDate = parseDateKey(todayKey);
  const yesterdayKey = getSeoulDateKey(new Date(baseDate.getTime() - ONE_DAY_MS));
  const twoDaysAgoKey = getSeoulDateKey(new Date(baseDate.getTime() - ONE_DAY_MS * 2));

  return {
    [todayKey]: [
      buildSeedItem(todayKey, '엄마', '작은 일에도 감사하는 하루가 되길 기도해요.', 7, 42),
      buildSeedItem(todayKey, '아빠', '오늘 말씀 붙들고 우리 가족이 서로 격려하게 해주세요.', 7, 18),
    ],
    [yesterdayKey]: [
      buildSeedItem(yesterdayKey, '아셀(첫째)', '학교에서도 말씀을 기억하고 싶어요.', 20, 11),
      buildSeedItem(yesterdayKey, '이삭(둘째)', '친구들과 잘 지내게 해주셔서 감사해요.', 19, 24),
    ],
    [twoDaysAgoKey]: [
      buildSeedItem(twoDaysAgoKey, '조이(셋째)', '우리 가족 모두 건강하게 지켜주세요.', 20, 5),
    ],
  };
}

function readStore(): FamilyFeedStore {
  if (typeof window === 'undefined') {
    return {};
  }

  const raw = window.localStorage.getItem(FAMILY_FEED_STORAGE_KEY);

  if (!raw) {
    const seedStore = getSeedStore();
    window.localStorage.setItem(FAMILY_FEED_STORAGE_KEY, JSON.stringify(seedStore));
    return seedStore;
  }

  try {
    const parsed = JSON.parse(raw) as FamilyFeedStore;

    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {
    // ignore parse error and fall back to seed
  }

  const seedStore = getSeedStore();
  window.localStorage.setItem(FAMILY_FEED_STORAGE_KEY, JSON.stringify(seedStore));
  return seedStore;
}

function writeStore(store: FamilyFeedStore) {
  window.localStorage.setItem(FAMILY_FEED_STORAGE_KEY, JSON.stringify(store));
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
