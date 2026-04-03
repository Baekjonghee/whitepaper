import type { ReactNode } from 'react';
import type { Verse } from '@/lib/verses';

type ScriptureCardProps = {
  verse: Verse;
  dateLabel: string;
  compact?: boolean;
  actions?: ReactNode;
};

export default function ScriptureCard({
  verse,
  dateLabel,
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
        style={{ backgroundImage: "url('/images/nature-morning.svg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/18 via-white/12 to-black/18" />

      <div className="relative flex h-full flex-col justify-between p-6 text-slate-900 sm:p-8 lg:p-10">
        <div className="max-w-3xl rounded-[28px] border border-white/35 bg-[rgba(255,255,255,0.70)] p-5 backdrop-blur-sm sm:p-7">
          <p className="text-sm font-medium tracking-[0.18em] text-slate-600 uppercase">
            Today&apos;s Verse
          </p>
          <p className="mt-2 text-sm text-slate-600">{dateLabel}</p>

          <div className="mt-6 space-y-5">
            <span className="inline-flex rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-amber-900 shadow-sm">
              {verse.reference}
            </span>
            <h2
              className={`font-semibold leading-relaxed text-slate-900 ${
                compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl lg:text-5xl'
              }`}
            >
              {verse.text}
            </h2>
            <p className="border-l-4 border-amber-800/70 pl-4 text-sm leading-7 text-slate-700 sm:text-base">
              묵상 질문 · {verse.meditationPrompt}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/95 drop-shadow-sm">
            아침 말씀을 천천히 읽고, 오늘 하루의 기도제목을 한 줄로 정리해보세요.
          </p>
          {actions}
        </div>
      </div>
    </section>
  );
}
