import { APP_LAUNCH_DATE_KEY, getTodayDateKey, isValidDateKey } from '@/lib/daily-verse';

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

export const FAMILY_FEED_MAX_LENGTH = 70;

export function isFamilyAuthor(value: string): value is FamilyAuthor {
  return FAMILY_AUTHORS.includes(value as FamilyAuthor);
}

export function validateFamilyFeedInput(input: {
  dateKey: string;
  author: string;
  content: string;
}): {
  dateKey: string;
  author: FamilyAuthor;
  content: string;
} {
  const trimmedContent = input.content.trim();

  if (!isValidDateKey(input.dateKey) || input.dateKey < APP_LAUNCH_DATE_KEY) {
    throw new Error('유효한 날짜가 아닙니다.');
  }

  if (input.dateKey !== getTodayDateKey()) {
    throw new Error('오늘 날짜 피드만 작성할 수 있습니다.');
  }

  if (!isFamilyAuthor(input.author)) {
    throw new Error('작성자를 선택해 주세요.');
  }

  if (!trimmedContent) {
    throw new Error('피드 내용을 입력해 주세요.');
  }

  if (trimmedContent.length > FAMILY_FEED_MAX_LENGTH) {
    throw new Error('피드는 70자 이하로 입력해 주세요.');
  }

  return {
    dateKey: input.dateKey,
    author: input.author,
    content: trimmedContent,
  };
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
