import Link from 'next/link';
import TopTabs from '@/components/top-tabs';
import { getDateArchiveSummaries } from '@/lib/daily-verse';

function buildPreviewText(text: string) {
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  return normalizedText.length > 56 ? `${normalizedText.slice(0, 56)}...` : normalizedText;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ArchivePage() {
  const items = await getDateArchiveSummaries();

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 pb-10 pt-4 sm:px-6">
      <header className="mb-3">
        <p className="text-sm font-semibold tracking-[0.08em] text-violet-600">감사나눔</p>
      </header>

      <TopTabs />

      <section className="mt-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.dateKey}
            href={`/verses/${item.dateKey}`}
            className="block rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:border-slate-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-violet-600">{item.dateLabel}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{item.verse.reference}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{buildPreviewText(item.verse.text)}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-slate-400">보기</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
