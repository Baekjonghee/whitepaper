import FamilyFeedSection from '@/components/family-feed-section';
import TodayVersePanel from '@/components/today-verse-panel';
import TopTabs from '@/components/top-tabs';
import { getTodayDateKey } from '@/lib/daily-verse';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CardPage() {
  const todayDateKey = getTodayDateKey();

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 pb-32 pt-4 sm:px-6">
      <header className="mb-4">
        <p className="text-sm font-semibold tracking-[0.08em] text-violet-600">
          감사나눔
        </p>
      </header>

      <TopTabs />

      <section className="mt-5">
        <TodayVersePanel showCardLink={false} />
      </section>

      <section className="mt-5">
        <FamilyFeedSection dateKey={todayDateKey} title="오늘의 감사 나눔" fixedComposer />
      </section>
    </main>
  );
}
