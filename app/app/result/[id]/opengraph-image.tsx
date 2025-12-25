import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Your AWS Identity 2025 Gift Card';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

/**
 * OGP画像生成
 * 
 * 要件9.9に対応：
 * - 生成済みギフトカード画像をOGP画像として使用
 */
export default async function Image({ params }: { params: { id: string } }) {
  // Note: LocalStorageはサーバーサイドでアクセスできないため、
  // 代わりにデフォルトのOGP画像を返す
  // 実際のギフトカード画像はクライアント側でシェア時に使用される
  
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #991b1b 0%, #166534 30%, #991b1b 60%, #854d0e 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>🎁</div>
        <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 20 }}>
          Your AWS Identity 2025
        </div>
        <div style={{ fontSize: 40, color: '#fbbf24' }}>
          あなたに贈る「代名詞」
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
