import Link from 'next/link';
import TodayVersePanel from '@/components/today-verse-panel';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 sm:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-amber-900 uppercase">
            Daily Bible Meditation
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-5xl">
            오늘의 말씀으로 하루를 시작하세요
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
            매일 한 구절의 말씀과 묵상 질문을 카드 형태로 보여주는 반응형 웹앱입니다.
            복잡한 가입 없이, 오늘의 말씀을 바로 보고 저장할 수 있습니다.
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

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-white/75 p-6 shadow-sm backdrop-blur-sm">
          <p className="text-sm font-semibold text-amber-900">핵심 기능 1</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">오늘의 말씀 표시</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            날짜 기준으로 오늘의 말씀을 자동 선택하여 첫 화면에서 바로 보여줍니다.
          </p>
        </div>

        <div className="rounded-3xl bg-white/75 p-6 shadow-sm backdrop-blur-sm">
          <p className="text-sm font-semibold text-amber-900">핵심 기능 2</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">자연 배경 말씀 카드</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            아침 분위기의 자연 배경 위에 말씀과 묵상 질문을 카드 UI로 제공합니다.
          </p>
        </div>

        <div className="rounded-3xl bg-white/75 p-6 shadow-sm backdrop-blur-sm">
          <p className="text-sm font-semibold text-amber-900">핵심 기능 3</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">모바일 반응형</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            모바일 세로 화면에서도 카드와 버튼이 자연스럽게 보이도록 구성했습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
