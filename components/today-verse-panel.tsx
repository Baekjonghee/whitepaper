import Link from 'next/link';
import ScriptureCard from '@/components/scripture-card';
import { formatDateKey, getTodayDateKey, getVerseForDateKey } from '@/lib/daily-verse';
import { getVerseBackgroundByDateKey } from '@/lib/verse-backgrounds';

type TodayVersePanelProps = {
  compact?: boolean;
  showCardLink?: boolean;
};

export default async function TodayVersePanel({
  compact = false,
  showCardLink = true,
}: TodayVersePanelProps) {
  const todayDateKey = getTodayDateKey();
  const verse = await getVerseForDateKey(todayDateKey);
  const background = getVerseBackgroundByDateKey(todayDateKey);
  const dateLabel = formatDateKey(todayDateKey);

  return (
    <ScriptureCard
      verse={verse}
      dateLabel={dateLabel}
      background={background}
      compact={compact}
      actions={
        showCardLink ? (
          <Link
            href="/card"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            카드 보기
          </Link>
        ) : null
      }
    />
  );
}
