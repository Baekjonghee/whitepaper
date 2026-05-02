import Link from 'next/link';
import TopTabs from '@/components/top-tabs';
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
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 pb-10 pt-4 sm:px-6">
      <header className="mb-4">
        <p className="text-sm font-semibold tracking-[0.08em] text-violet-600">
          감사나눔
        </p>
      </header>

      <TopTabs />

      <section className="mt-5 rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h1 className="text-lg font-bold text-slate-900">일자별 기록</h1>
        </div>

        <div className="space-y-3 px-5 py-4">
          {items.map((item) => (
            <Link
              key={item.dateKey}
              href={`/verses/${item.dateKey}`}
              className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center justify-between gap-3">
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
        </div>
      </section>
    </main>
  );
}
