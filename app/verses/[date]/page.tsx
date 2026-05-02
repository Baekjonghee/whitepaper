import TopTabs from '@/components/top-tabs';
import { notFound } from 'next/navigation';
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

export default async function VerseDetailPage({ params }: VerseDetailPageProps) {
  const { date } = await params;

  if (!isValidDateKey(date)) {
    notFound();
  }

  const verse = await getVerseForDateKey(date);
  const background = getVerseBackgroundByDateKey(date);
  const dateLabel = formatDateKey(date);

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 pb-8 pt-4 sm:px-6">
      <header className="mb-3">
        <p className="text-sm font-semibold tracking-[0.08em] text-violet-600">감사나눔</p>
      </header>

      <TopTabs />

      <section className="mt-4">
        <ScriptureCard verse={verse} dateLabel={dateLabel} background={background} compact />
      </section>

      <section className="mt-4">
        <FamilyFeedSection dateKey={date} readOnly title="감사 나눔" fixedComposer={false} />
      </section>
    </main>
  );
}
