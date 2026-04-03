import Link from 'next/link';
import TodayVersePanel from '@/components/today-verse-panel';

export default function CardPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-amber-900 uppercase">
            Verse Card
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            오늘의 말씀 카드
          </h1>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
        >
          홈으로 돌아가기
        </Link>
      </div>

      <TodayVersePanel />
    </main>
  );
}
