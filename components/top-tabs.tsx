'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: '오늘' },
  { href: '/archive', label: '기록' },
  { href: '/favorites', label: '저장' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export default function TopTabs() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-200">
      <div className="flex items-center gap-6 overflow-x-auto">
        {tabs.map((tab) => {
          const active = isActive(pathname, tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative whitespace-nowrap py-3 text-sm font-semibold transition ${
                active ? 'text-violet-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
              {active ? (
                <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-violet-600" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
