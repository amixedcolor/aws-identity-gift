import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: 'linear-gradient(135deg, #dc2626 0%, #16a34a 50%, #ca8a04 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '30%',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        }}
      >
        🎁
      </div>
    ),
    {
      ...size,
    }
  );
}
