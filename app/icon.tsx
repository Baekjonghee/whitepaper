import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            width: 392,
            height: 392,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f3ff',
            borderRadius: 96,
            border: '16px solid #7c3aed',
            position: 'relative',
          }}
        >
          <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M110 178C85 160 52 135 52 94C52 69 71 52 95 52C108 52 120 58 128 68C136 58 148 52 161 52C185 52 204 69 204 94C204 135 171 160 146 178L128 191L110 178Z" fill="#7C3AED" opacity="0.16"/>
            <path d="M110 178C85 160 52 135 52 94C52 69 71 52 95 52C108 52 120 58 128 68C136 58 148 52 161 52C185 52 204 69 204 94C204 135 171 160 146 178L128 191L110 178Z" stroke="#7C3AED" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M53 28L53 52" stroke="#A78BFA" strokeWidth="12" strokeLinecap="round"/>
            <path d="M41 40H65" stroke="#A78BFA" strokeWidth="12" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
