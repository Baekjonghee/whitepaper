export type Verse = {
  id: string;
  reference: string;
  text: string;
  meditationPrompt: string;
};

export const VERSES: Verse[] = [
  {
    id: 'psalm-23-1',
    reference: '시편 23:1',
    text: '여호와는 나의 목자시니 내게 부족함이 없으리로다.',
    meditationPrompt: '오늘 나를 인도하시는 하나님을 신뢰해야 할 영역은 무엇인가요?',
  },
  {
    id: 'isaiah-40-31',
    reference: '이사야 40:31',
    text: '오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요.',
    meditationPrompt: '지친 마음을 하나님께 맡기며 새 힘을 구해야 할 부분은 무엇인가요?',
  },
  {
    id: 'matthew-11-28',
    reference: '마태복음 11:28',
    text: '수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라.',
    meditationPrompt: '내가 내려놓고 주님께 가져가야 할 짐은 무엇인가요?',
  },
  {
    id: 'john-15-5',
    reference: '요한복음 15:5',
    text: '나는 포도나무요 너희는 가지라 그가 내 안에, 내가 그 안에 거하면 사람이 열매를 많이 맺나니.',
    meditationPrompt: '오늘 말씀과 기도로 주님 안에 머물 시간을 어떻게 확보할 수 있을까요?',
  },
  {
    id: 'philippians-4-6',
    reference: '빌립보서 4:6',
    text: '아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로 너희 구할 것을 하나님께 아뢰라.',
    meditationPrompt: '염려 대신 기도로 바꾸어야 할 오늘의 기도제목은 무엇인가요?',
  },
  {
    id: 'romans-8-28',
    reference: '로마서 8:28',
    text: '하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라.',
    meditationPrompt: '이해되지 않는 상황 속에서도 하나님이 일하신다고 믿어야 할 장면은 무엇인가요?',
  },
  {
    id: 'joshua-1-9',
    reference: '여호수아 1:9',
    text: '강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라.',
    meditationPrompt: '오늘 담대함이 필요한 관계나 일이 있다면 무엇인가요?',
  },
  {
    id: 'lamentations-3-22-23',
    reference: '예레미야애가 3:22-23',
    text: '여호와의 인자와 긍휼이 무궁하시므로 우리가 진멸되지 아니함이니이다. 이것들이 아침마다 새로우니 주의 성실하심이 크시도소이다.',
    meditationPrompt: '새로운 아침에 주신 은혜를 오늘 어떻게 기억하고 반응할 수 있을까요?',
  },
];

export function getTodayVerse(date: Date = new Date()): Verse {
  const year = date.getFullYear();
  const start = new Date(year, 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  return VERSES[dayOfYear % VERSES.length];
}

export function formatKoreanDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

export type FavoriteVerse = Verse & {
  savedAt: string;
};

export const FAVORITES_STORAGE_KEY = 'daily-bible-meditation:favorites';

export function readFavoriteVerses(): FavoriteVerse[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as FavoriteVerse[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeFavoriteVerses(items: FavoriteVerse[]) {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
}
