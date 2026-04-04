import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #67c3f3 0%, #51c18f 55%, #84cc16 100%)',
          borderRadius: 36,
        }}
      >
        <svg width="112" height="112" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M84 118C96 112 114 108 136 108C154 108 170 112 182 122V176C170 166 154 162 136 162C116 162 98 166 84 172V118Z" fill="white"/>
          <path d="M236 118C224 112 206 108 184 108C166 108 150 112 138 122V176C150 166 166 162 184 162C204 162 222 166 236 172V118Z" fill="white"/>
          <path d="M76 174C94 166 116 162 136 162C160 162 180 168 192 182" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M244 174C226 166 204 162 184 162C160 162 140 168 128 182" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M160 66V132" stroke="white" strokeWidth="18" strokeLinecap="round"/>
          <path d="M127 99H193" stroke="white" strokeWidth="18" strokeLinecap="round"/>
          <path d="M90 92C90 79 100 70 113 70C123 70 131 76 134 85C137 76 145 70 155 70C168 70 178 79 178 92C178 118 151 132 134 144C117 132 90 118 90 92Z" fill="white" opacity="0.92" transform="translate(-28, 0) scale(0.7)"/>
          <path d="M90 92C90 79 100 70 113 70C123 70 131 76 134 85C137 76 145 70 155 70C168 70 178 79 178 92C178 118 151 132 134 144C117 132 90 118 90 92Z" fill="white" opacity="0.92" transform="translate(112, 0) scale(0.7)"/>
        </svg>
      </div>
    ),
    {
      ...size,
    },
  );
}
