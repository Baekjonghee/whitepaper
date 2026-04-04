import type { Metadata } from 'next';
import SiteFooter from '@/components/site-footer';
import './globals.css';

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? '매일 성경 묵상';

export const metadata: Metadata = {
  title: `${appName} | 오늘의 말씀`,
  description: '오늘의 말씀과 묵상 카드를 보여주는 반응형 웹서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
