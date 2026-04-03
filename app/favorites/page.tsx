import Link from 'next/link';
import FavoritesList from '@/components/favorites-list';

export default function FavoritesPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-6 sm:px-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-amber-900 uppercase">
            Favorites
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            저장한 말씀
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            마음에 남긴 말씀을 다시 읽고 묵상할 수 있는 화면입니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/card"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            오늘의 말씀 카드
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
          >
            홈으로
          </Link>
        </div>
      </div>

      <FavoritesList />
    </main>
  );
}
