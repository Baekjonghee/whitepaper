function hashString(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

export type VerseBackground = {
  id: string;
  imageUrl: string;
  providerLabel: string;
  sourcePageUrl: string;
};

const VERSE_BACKGROUNDS: VerseBackground[] = [
  {
    id: 'nature-morning',
    imageUrl: '/images/nature-morning.svg',
    providerLabel: 'Pixabay 자연 이미지 연동 준비',
    sourcePageUrl: 'https://pixabay.com/images/search/backgrounds/',
  },
];

export function getVerseBackgroundByDateKey(dateKey: string): VerseBackground {
  const backgroundIndex = hashString(dateKey) % VERSE_BACKGROUNDS.length;
  return VERSE_BACKGROUNDS[backgroundIndex]!;
}
