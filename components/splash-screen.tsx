'use client';

import { useEffect, useState } from 'react';

const SPLASH_DURATION_MS = 700;
const FADE_DURATION_MS = 180;

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFading(true), SPLASH_DURATION_MS);
    const hideTimer = window.setTimeout(
      () => setVisible(false),
      SPLASH_DURATION_MS + FADE_DURATION_MS,
    );

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[linear-gradient(180deg,#fffaf2_0%,#f9f1ff_100%)] px-6 transition-opacity duration-200 ${
        fading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="rounded-[28px] border border-white/70 bg-white/80 px-8 py-10 text-center shadow-[0_20px_60px_rgba(63,41,103,0.12)] backdrop-blur-sm">
        <p className="text-sm font-semibold tracking-[0.18em] text-violet-500 uppercase">
          gratitude
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">감사나눔</h1>
        <p className="mt-3 text-sm text-slate-600">하루 한번 감사 습관</p>
      </div>
    </div>
  );
}
