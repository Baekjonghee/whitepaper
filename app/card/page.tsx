import Link from 'next/link';
import FamilyFeedSection from '@/components/family-feed-section';
import TodayVersePanel from '@/components/today-verse-panel';
import { getTodayDateKey } from '@/lib/daily-verse';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CardPage() {
  const todayDateKey = getTodayDateKey();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-[0.08em] text-violet-600">
            감사나눔
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            매일 새로운 말씀
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/archive"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            기록 보기
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
          >
            홈으로
          </Link>
        </div>
      </div>

      <TodayVersePanel showCardLink={false} />

      <section className="mt-8">
        <FamilyFeedSection dateKey={todayDateKey} title="오늘의 감사 나눔" />
      </section>
    </main>
  );
}
