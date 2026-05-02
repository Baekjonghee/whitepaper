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
  background: _background,
  compact = false,
  actions,
}: ScriptureCardProps) {
  return (
    <section
      className={`rounded-[28px] border border-slate-200 bg-white shadow-sm ${
        compact ? 'min-h-[320px]' : 'min-h-[420px]'
      }`}
    >
      <div className="flex h-full flex-col justify-between p-6 text-slate-900 sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm text-slate-500">{dateLabel}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">
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

        {actions ? <div className="mt-8 flex justify-end">{actions}</div> : null}
      </div>
    </section>
  );
}
