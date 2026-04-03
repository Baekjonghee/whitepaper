'use client';

import { useEffect, useState } from 'react';
import {
  readFavoriteVerses,
  writeFavoriteVerses,
  type FavoriteVerse,
  type Verse,
} from '@/lib/verses';

type FavoriteToggleButtonProps = {
  verse: Verse;
};

export default function FavoriteToggleButton({
  verse,
}: FavoriteToggleButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const favorites = readFavoriteVerses();
    setIsSaved(favorites.some((item) => item.id === verse.id));
  }, [verse.id]);

  const handleToggle = () => {
    const favorites = readFavoriteVerses();
    const exists = favorites.some((item) => item.id === verse.id);

    if (exists) {
      const nextFavorites = favorites.filter((item) => item.id !== verse.id);
      writeFavoriteVerses(nextFavorites);
      setIsSaved(false);
      return;
    }

    const nextItem: FavoriteVerse = {
      ...verse,
      savedAt: new Date().toISOString(),
    };

    writeFavoriteVerses([nextItem, ...favorites]);
    setIsSaved(true);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center justify-center rounded-full border border-white/65 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
    >
      {isSaved ? '저장됨' : '즐겨찾기 저장'}
    </button>
  );
}
