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
          fontSize: 100,
          background: '#1a1a2e',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#E63946',
          fontWeight: 900,
          fontFamily: 'system-ui, sans-serif',
          borderRadius: 24,
        }}
      >
        B
      </div>
    ),
    {
      ...size,
    }
  );
}
