import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '말씀나눔',
    short_name: '말씀나눔',
    description: '같은 말씀을 함께 묵상하고 기도제목과 감사나눔을 남기는 웹앱',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f2e8',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
