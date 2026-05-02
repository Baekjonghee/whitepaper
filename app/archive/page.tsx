import Link from 'next/link';
import { getDateArchiveSummaries } from '@/lib/daily-verse';

function buildPreviewText(text: string) {
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  return normalizedText.length > 84
    ? `${normalizedText.slice(0, 84)}...`
    : normalizedText;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ArchivePage() {
  const items = await getDateArchiveSummaries();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-[0.08em] text-violet-600">
            감사나눔
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            일자별 기록 보기
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            날짜별 말씀과 감사 나눔을 확인하세요.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
        >
          홈으로
        </Link>
      </div>

      <section className="grid gap-3">
        {items.map((item) => (
          <Link
            key={item.dateKey}
            href={`/verses/${item.dateKey}`}
            className="rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-violet-600">{item.dateLabel}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {item.verse.reference}
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">보기</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {buildPreviewText(item.verse.text)}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
