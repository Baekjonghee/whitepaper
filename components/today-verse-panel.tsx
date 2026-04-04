'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import FavoriteToggleButton from '@/components/favorite-toggle-button';
import ScriptureCard from '@/components/scripture-card';
import { formatDateKey, getTodayDateKey, getVerseForDateKey } from '@/lib/daily-verse';
import { getVerseBackgroundByDateKey } from '@/lib/verse-backgrounds';

type TodayVersePanelProps = {
  compact?: boolean;
  showCardLink?: boolean;
};

export default function TodayVersePanel({
  compact = false,
  showCardLink = true,
}: TodayVersePanelProps) {
  const [todayDateKey, setTodayDateKey] = useState('');

  useEffect(() => {
    setTodayDateKey(getTodayDateKey());
  }, []);

  const verse = useMemo(() => {
    if (!todayDateKey) {
      return null;
    }

    return getVerseForDateKey(todayDateKey);
  }, [todayDateKey]);

  const background = useMemo(() => {
    if (!todayDateKey) {
      return null;
    }

    return getVerseBackgroundByDateKey(todayDateKey);
  }, [todayDateKey]);

  const dateLabel = useMemo(() => {
    if (!todayDateKey) {
      return '';
    }

    return formatDateKey(todayDateKey);
  }, [todayDateKey]);

  if (!verse || !background) {
    return (
      <div className="min-h-[360px] animate-pulse rounded-[32px] border border-white/50 bg-white/40" />
    );
  }

  return (
    <ScriptureCard
      verse={verse}
      dateLabel={dateLabel}
      background={background}
      compact={compact}
      actions={
        <div className="flex flex-wrap gap-3">
          {showCardLink ? (
            <Link
              href="/card"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              오늘의 말씀 카드
            </Link>
          ) : null}
          <FavoriteToggleButton verse={verse} />
        </div>
      }
    />
  );
}
