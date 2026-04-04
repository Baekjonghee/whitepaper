import Link from 'next/link';
import { notFound } from 'next/navigation';
import FavoriteToggleButton from '@/components/favorite-toggle-button';
import FamilyFeedSection from '@/components/family-feed-section';
import ScriptureCard from '@/components/scripture-card';
import { formatDateKey, getVerseForDateKey, isValidDateKey } from '@/lib/daily-verse';
import { getVerseBackgroundByDateKey } from '@/lib/verse-backgrounds';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type VerseDetailPageProps = {
  params: Promise<{
    date: string;
  }>;
};

export default async function VerseDetailPage({
  params,
}: VerseDetailPageProps) {
  const { date } = await params;

  if (!isValidDateKey(date)) {
    notFound();
  }

  const verse = await getVerseForDateKey(date);
  const background = getVerseBackgroundByDateKey(date);
  const dateLabel = formatDateKey(date);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-[0.08em] text-amber-900">
            말씀나눔
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            지난 말씀 상세
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/card"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            오늘의 말씀
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
          >
            홈으로
          </Link>
        </div>
      </div>

      <ScriptureCard
        verse={verse}
        dateLabel={dateLabel}
        background={background}
        actions={<FavoriteToggleButton verse={verse} />}
      />

      <section className="mt-8">
        <FamilyFeedSection dateKey={date} readOnly />
      </section>
    </main>
  );
}
