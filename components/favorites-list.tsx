'use client';

import { useEffect, useState } from 'react';
import {
  formatKoreanDate,
  readFavoriteVerses,
  writeFavoriteVerses,
  type FavoriteVerse,
} from '@/lib/verses';

export default function FavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);

  useEffect(() => {
    setFavorites(readFavoriteVerses());
  }, []);

  const handleRemove = (id: string) => {
    const nextFavorites = favorites.filter((item) => item.id !== id);
    writeFavoriteVerses(nextFavorites);
    setFavorites(nextFavorites);
  };

  if (favorites.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-800">아직 저장한 말씀이 없습니다.</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          오늘의 말씀 카드에서 <span className="font-semibold">즐겨찾기 저장</span> 버튼을 누르면
          여기에 쌓입니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {favorites.map((item) => (
        <article
          key={item.id}
          className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-900">{item.reference}</p>
              <h2 className="mt-2 text-lg font-semibold leading-8 text-slate-900">{item.text}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                저장일 · {formatKoreanDate(new Date(item.savedAt))}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="inline-flex h-fit items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              삭제
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
