import type { Schema } from '../../data/resource';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({ region: 'us-east-1' });

/**
 * ギフトカード画像生成Function
 * 
 * 要件9.2, 9.3, 9.4, 9.5, 9.8に対応：
 * - Amazon Nova Canvasでビジュアル画像を生成
 * - Base64エンコードで返却
 * - サーバー側で画像を保存しない
 */
export const handler: Schema['giftCard']['functionHandler'] = async (event) => {
  const { resultData, userName } = event.arguments;

  // 入力検証
  if (!resultData) {
    console.error('No result data provided');
    return {
      imageData: null,
      error: '診断結果データが必要です',
    };
  }

  try {
    // JSON文字列をパース
    const result = JSON.parse(resultData);

    if (!result.service || !result.service.serviceName || !result.catchphrase) {
      console.error('Invalid result data:', result);
      return {
        imageData: null,
        error: '診断結果データが不正です',
      };
    }

    // Amazon Nova Canvasで画像を生成
    console.log('Generating image with Amazon Nova Canvas...');
    const imageBase64 = await generateImageWithNovaCanvas(result, userName || undefined);
    
    console.log('Gift card generated successfully');
    return {
      imageData: imageBase64,
      error: null,
    };
    
  } catch (error) {
    console.error('Gift card generation error:', error);

    // エラータイプに応じた処理
    if (error && typeof error === 'object' && 'name' in error) {
      const errorName = (error as { name: string }).name;

      if (errorName === 'ThrottlingException') {
        return {
          imageData: null,
          error: 'リクエストが多すぎます。しばらく待ってから再試行してください',
        };
      }

      if (errorName === 'ValidationException') {
        return {
          imageData: null,
          error: '入力データが不正です',
        };
      }
    }

    return {
      imageData: null,
      error: 'ギフトカード生成中にエラーが発生しました',
    };
  }
};

/**
 * Amazon Nova Canvasで画像を生成
 * 
 * 要件9.3, 9.4に対応：
 * - AWSサービスに相応しいビジュアル画像を生成
 * - 画像には文字情報を含めない（フロントエンドでオーバーレイ）
 */
async function generateImageWithNovaCanvas(result: any, userName?: string): Promise<string> {
  const serviceName = result.service.serviceName;
  const category = result.service.category;
  const catchphrase = result.catchphrase;
  
  // 画像生成用のプロンプトを構築
  // 要件9.4: 画像には一切の文字情報を含めない
  const prompt = buildImagePrompt(serviceName, category, catchphrase);
  
  // ランダムシード（0〜858,993,459）
  const seed = Math.floor(Math.random() * 858993460);
  
  // Nova Canvas APIリクエスト
  const request = {
    taskType: 'TEXT_IMAGE',
    textToImageParams: {
      text: prompt,
    },
    imageGenerationConfig: {
      seed,
      quality: 'standard',
      width: 1280,
      height: 720,
      numberOfImages: 1,
    },
  };

  const command = new InvokeModelCommand({
    modelId: 'amazon.nova-canvas-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(request),
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  
  // Base64エンコードされた画像を取得
  const base64Image = responseBody.images[0];
  
  return base64Image;
}

/**
 * 画像生成用のプロンプトを構築
 * 
 * 要件9.4に対応：
 * - 画像には一切の文字やテキストを含めない
 * - AWSサービスを象徴する抽象的なビジュアル
 * - キャッチコピーの雰囲気を反映
 * - クリスマスの雰囲気
 */
function buildImagePrompt(serviceName: string, category: string, catchphrase: string): string {
  // サービスカテゴリに基づいたビジュアル要素を決定
  const categoryVisuals: Record<string, string> = {
    'コンピューティング': 'glowing processors, circuit patterns, digital energy flows',
    'ストレージ': 'crystalline data structures, floating storage cubes, light streams',
    'データベース': 'interconnected nodes, data constellation, flowing information streams',
    'ネットワーキングとコンテンツ配信': 'network mesh, global connections, light beams connecting points',
    'セキュリティ、アイデンティティ、コンプライアンス': 'protective shields, secure locks, guardian symbols',
    '機械学習': 'neural network patterns, AI brain visualization, learning pathways',
    '分析': 'data visualization, charts transforming into light, insight beams',
    'アプリケーション統合': 'puzzle pieces connecting, flowing bridges, unified systems',
    'マネジメントとガバナンス': 'control panels, orchestration flows, management dashboards',
    '開発者ツール': 'code streams, development pipelines, creative tools',
    'コンテナ': 'modular containers, orchestrated boxes, scalable units',
    'サーバーレス': 'abstract cloud formations, event-driven flows, serverless magic',
  };
  
  const visualElements = categoryVisuals[category] || 'abstract cloud technology, digital innovation';
  
  return `A beautiful, abstract digital art illustration representing ${serviceName} AWS service.
The image should capture the essence of "${catchphrase}" through visual metaphors and artistic interpretation.
The image should feature ${visualElements}.
Style: Modern, sleek, professional tech aesthetic with Christmas holiday warmth that reflects the personality of "${catchphrase}".
Color palette: Deep reds, forest greens, and golden accents creating a festive yet professional atmosphere.
Include subtle snowflakes and warm lighting effects.
The overall mood and composition should evoke the feeling of "${catchphrase}".
The image should feel like a premium gift card design.
IMPORTANT: Do NOT include any text, letters, words, or numbers in the image. Pure visual art only.
No logos, no labels, no watermarks.`;
}
