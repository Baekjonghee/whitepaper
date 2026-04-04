import type { Metadata } from 'next';
import SiteFooter from '@/components/site-footer';
import './globals.css';

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? '말씀나눔';

export const metadata: Metadata = {
  title: `${appName} | 오늘의 말씀`,
  description: '같은 말씀을 함께 묵상하고 기도제목과 감사나눔을 남기는 웹앱',
  applicationName: appName,
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
