import Link from 'next/link';
import FamilyFeedSection from '@/components/family-feed-section';
import RecentVerseList from '@/components/recent-verse-list';
import TodayVersePanel from '@/components/today-verse-panel';
import { getTodayDateKey } from '@/lib/daily-verse';

export default function HomePage() {
  const todayDateKey = getTodayDateKey();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 sm:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.08em] text-amber-900">
            말씀나눔
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-5xl">
            오늘의 말씀으로 하루를 시작
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
            같은 말씀을 함께 묵상하고 기도제목과 감사나눔을 남겨요.
          </p>
        </div>

        <nav className="flex flex-wrap gap-3">
          <Link
            href="/card"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            오늘의 말씀 카드
          </Link>
          <Link
            href="/favorites"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
          >
            즐겨찾기
          </Link>
        </nav>
      </header>

      <section className="mt-8">
        <TodayVersePanel compact />
      </section>

      <section className="mt-8">
        <FamilyFeedSection dateKey={todayDateKey} />
      </section>

      <section className="mt-8">
        <RecentVerseList />
      </section>
    </main>
  );
}
