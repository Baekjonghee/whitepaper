'use client';

import { useEffect, useState } from 'react';

const SPLASH_DURATION_MS = 1200;
const FADE_DURATION_MS = 280;

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true);
    }, SPLASH_DURATION_MS);

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, SPLASH_DURATION_MS + FADE_DURATION_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#fff9ef_0%,#e8f3ff_45%,#e8f6e7_100%)] px-6 transition-opacity duration-300 ${
        isFadingOut ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),transparent_34%)]" />

      <div className="relative flex w-full max-w-sm flex-col items-center text-center">
        <div className="rounded-[36px] bg-white/72 p-4 shadow-[0_20px_60px_rgba(88,94,120,0.16)] backdrop-blur-sm">
          <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[linear-gradient(180deg,#67c3f3_0%,#51c18f_55%,#84cc16_100%)] shadow-[0_12px_30px_rgba(68,124,96,0.28)]">
            <svg width="58" height="58" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M84 118C96 112 114 108 136 108C154 108 170 112 182 122V176C170 166 154 162 136 162C116 162 98 166 84 172V118Z" fill="white"/>
              <path d="M236 118C224 112 206 108 184 108C166 108 150 112 138 122V176C150 166 166 162 184 162C204 162 222 166 236 172V118Z" fill="white"/>
              <path d="M76 174C94 166 116 162 136 162C160 162 180 168 192 182" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M244 174C226 166 204 162 184 162C160 162 140 168 128 182" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M160 66V132" stroke="white" strokeWidth="18" strokeLinecap="round"/>
              <path d="M127 99H193" stroke="white" strokeWidth="18" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <h1 className="mt-7 text-3xl font-bold tracking-[-0.02em] text-slate-900">
          말씀나눔
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
          오늘의 말씀으로 하루를 시작합니다
        </p>

        <div className="mt-7 flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-700/85 [animation-delay:0ms]" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-700/70 [animation-delay:160ms]" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-700/55 [animation-delay:320ms]" />
        </div>
      </div>
    </div>
  );
}
