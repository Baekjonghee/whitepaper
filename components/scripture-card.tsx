import type { ReactNode } from 'react';
import type { Verse } from '@/lib/verses';
import type { VerseBackground } from '@/lib/verse-backgrounds';

type ScriptureCardProps = {
  verse: Verse;
  dateLabel: string;
  background: VerseBackground;
  compact?: boolean;
  actions?: ReactNode;
};

export default function ScriptureCard({
  verse,
  dateLabel,
  background,
  compact = false,
  actions,
}: ScriptureCardProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-[32px] border border-white/50 bg-white/20 shadow-[0_20px_80px_rgba(78,55,28,0.14)] backdrop-blur-md ${
        compact ? 'min-h-[360px]' : 'min-h-[540px]'
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${background.imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-white/10 to-black/25" />

      <div className="relative flex h-full flex-col justify-between p-6 text-slate-900 sm:p-8 lg:p-10">
        <div className="max-w-3xl rounded-[28px] border border-white/35 bg-[rgba(255,255,255,0.72)] p-5 backdrop-blur-sm sm:p-7">
          <p className="text-sm font-medium tracking-[0.18em] text-slate-600 uppercase">
            Today&apos;s Verse
          </p>
          <p className="mt-2 text-sm text-slate-600">{dateLabel}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex rounded-full bg-white/75 px-3 py-1 text-sm font-semibold text-amber-900 shadow-sm">
              {verse.reference}
            </span>
          </div>

          <h2
            className={`mt-6 font-semibold leading-relaxed text-slate-900 ${
              compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl lg:text-5xl'
            }`}
          >
            {verse.text}
          </h2>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-white/95 drop-shadow-sm">
            <p className="text-sm">
              가족과 함께 오늘의 말씀을 나누고 기도제목 또는 감사나눔을 남겨보세요.
            </p>
          </div>
          {actions}
        </div>
      </div>
    </section>
  );
}
