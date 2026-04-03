'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import FavoriteToggleButton from '@/components/favorite-toggle-button';
import ScriptureCard from '@/components/scripture-card';
import { formatKoreanDate, getTodayVerse } from '@/lib/verses';

type TodayVersePanelProps = {
  compact?: boolean;
};

export default function TodayVersePanel({
  compact = false,
}: TodayVersePanelProps) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const verse = useMemo(() => {
    if (!currentDate) {
      return null;
    }

    return getTodayVerse(currentDate);
  }, [currentDate]);

  const dateLabel = useMemo(() => {
    if (!currentDate) {
      return '';
    }

    return formatKoreanDate(currentDate);
  }, [currentDate]);

  if (!verse) {
    return (
      <div className="min-h-[360px] animate-pulse rounded-[32px] border border-white/50 bg-white/40" />
    );
  }

  return (
    <ScriptureCard
      verse={verse}
      dateLabel={dateLabel}
      compact={compact}
      actions={
        <div className="flex flex-wrap gap-3">
          <Link
            href="/card"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            말씀 카드 보기
          </Link>
          <FavoriteToggleButton verse={verse} />
        </div>
      }
    />
  );
}
