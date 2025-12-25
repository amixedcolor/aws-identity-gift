import type { Schema } from '../../data/resource';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({ region: 'us-east-1' });

/**
 * エラーメッセージの定義（日本語）
 * 要件12.5: 日本語でユーザーフレンドリーなエラーメッセージを提供
 */
const ERROR_MESSAGES = {
  NO_DATA: '診断結果データが必要です',
  INVALID_DATA: '診断結果データが不正です',
  THROTTLING: 'リクエストが多すぎます。しばらく待ってから再試行してください',
  VALIDATION: '入力データが不正です',
  SERVICE_UNAVAILABLE: '画像生成サービスが一時的に利用できません。しばらく待ってから再試行してください',
  ACCESS_DENIED: '画像生成サービスへのアクセスが拒否されました',
  CONTENT_FILTERED: '画像生成リクエストがコンテンツフィルターによりブロックされました',
  GENERAL: 'ギフトカード生成中にエラーが発生しました',
} as const;

/**
 * エラーをログ出力する
 * 要件12.4: デバッグ目的でエラーをコンソールにログ出力
 */
function logError(context: string, error: unknown, additionalInfo?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [${context}]`, {
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    ...additionalInfo,
  });
}

/**
 * Bedrockエラーからユーザー向けメッセージを取得
 */
function getBedrockErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'name' in error) {
    const errorName = (error as { name: string }).name;
    
    switch (errorName) {
      case 'ThrottlingException':
        return ERROR_MESSAGES.THROTTLING;
      case 'ValidationException':
        return ERROR_MESSAGES.VALIDATION;
      case 'ServiceUnavailableException':
        return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
      case 'AccessDeniedException':
        return ERROR_MESSAGES.ACCESS_DENIED;
      default:
        // エラーメッセージにcontent filterが含まれているかチェック
        if ('message' in error && typeof (error as { message: string }).message === 'string') {
          const message = (error as { message: string }).message.toLowerCase();
          if (message.includes('content') && message.includes('filter')) {
            return ERROR_MESSAGES.CONTENT_FILTERED;
          }
        }
        return ERROR_MESSAGES.GENERAL;
    }
  }
  return ERROR_MESSAGES.GENERAL;
}

/**
 * ギフトカード画像生成Function
 * 
 * 要件9.2, 9.3, 9.4, 9.5, 9.8に対応：
 * - Amazon Nova Canvasでビジュアル画像を生成
 * - Base64エンコードで返却
 * - サーバー側で画像を保存しない
 * 
 * 要件12.4, 12.5に対応：
 * - エラーをコンソールにログ出力
 * - 日本語でユーザーフレンドリーなエラーメッセージを提供
 */
export const handler: Schema['giftCard']['functionHandler'] = async (event) => {
  const { resultData, userName } = event.arguments;

  // 入力検証
  if (!resultData) {
    logError('giftCard.handler', new Error('No result data provided'));
    return {
      imageData: null,
      error: ERROR_MESSAGES.NO_DATA,
    };
  }

  try {
    // JSON文字列をパース
    let result: { service?: { serviceName?: string; category?: string }; catchphrase?: string };
    try {
      result = JSON.parse(resultData);
    } catch (parseError) {
      logError('giftCard.handler.parseInput', parseError, { resultData });
      return {
        imageData: null,
        error: ERROR_MESSAGES.INVALID_DATA,
      };
    }

    if (!result.service || !result.service.serviceName || !result.catchphrase) {
      logError('giftCard.handler', new Error('Invalid result data'), { 
        hasService: !!result.service,
        hasServiceName: !!result.service?.serviceName,
        hasCatchphrase: !!result.catchphrase,
      });
      return {
        imageData: null,
        error: ERROR_MESSAGES.INVALID_DATA,
      };
    }

    // Amazon Nova Canvasで画像を生成
    console.log('Generating image with Amazon Nova Canvas...');
    const imageBase64 = await generateImageWithNovaCanvas({
      service: {
        serviceName: result.service.serviceName,
        category: result.service.category || '',
      },
      catchphrase: result.catchphrase,
    }, userName || undefined);
    
    console.log('Gift card generated successfully');
    return {
      imageData: imageBase64,
      error: null,
    };
    
  } catch (error) {
    // エラーをログ出力
    logError('giftCard.handler.generate', error);

    // ユーザー向けメッセージを取得
    const userMessage = getBedrockErrorMessage(error);

    return {
      imageData: null,
      error: userMessage,
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
async function generateImageWithNovaCanvas(result: { service: { serviceName: string; category: string }; catchphrase: string }, _userName?: string): Promise<string> {
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

  try {
    const command = new InvokeModelCommand({
      modelId: 'amazon.nova-canvas-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(request),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // エラーレスポンスのチェック
    if (responseBody.error) {
      logError('generateImageWithNovaCanvas', new Error(responseBody.error), { serviceName, category });
      throw new Error(responseBody.error);
    }
    
    // 画像データの存在チェック
    if (!responseBody.images || !responseBody.images[0]) {
      logError('generateImageWithNovaCanvas', new Error('No image in response'), { responseBody });
      throw new Error('画像が生成されませんでした');
    }
    
    // Base64エンコードされた画像を取得
    const base64Image = responseBody.images[0];
    
    return base64Image;
  } catch (error) {
    logError('generateImageWithNovaCanvas.invoke', error, { serviceName, category, prompt });
    throw error;
  }
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
