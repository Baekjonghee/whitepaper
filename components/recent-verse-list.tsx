import Link from 'next/link';
import { getPastVerseSummaries } from '@/lib/daily-verse';

function buildPreviewText(text: string) {
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  return normalizedText.length > 84
    ? `${normalizedText.slice(0, 84)}...`
    : normalizedText;
}

export default async function RecentVerseList() {
  const verseItems = await getPastVerseSummaries(7);

  return (
    <section className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
      <div>
        <p className="text-sm font-semibold tracking-[0.18em] text-amber-900 uppercase">
          Recent Verses
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">지난 말씀</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          날짜별 말씀 상세 화면에서 해당 날짜의 가족 피드를 함께 확인할 수 있습니다.
        </p>
      </div>

      {verseItems.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center text-sm leading-6 text-slate-600">
          아직 지난 말씀 기록이 없습니다. 오늘부터 가족과 함께 말씀을 쌓아가세요.
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {verseItems.map((item) => (
            <Link
              key={item.dateKey}
              href={`/verses/${item.dateKey}`}
              className="rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-900">{item.dateLabel}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {item.verse.reference}
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-500">상세 보기</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {buildPreviewText(item.verse.text)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
