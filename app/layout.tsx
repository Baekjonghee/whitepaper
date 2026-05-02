import type { Metadata } from 'next';
import SiteFooter from '@/components/site-footer';
import SplashScreen from '@/components/splash-screen';
import './globals.css';

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? '감사나눔';

export const metadata: Metadata = {
  title: appName,
  description: '매일 새로운 말씀과 감사 나눔을 기록하는 웹앱',
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
        <SplashScreen />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
