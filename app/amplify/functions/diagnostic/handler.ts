import type { Schema } from '../../data/resource';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { buildDiagnosticPrompt } from './prompts';

const client = new BedrockRuntimeClient({ region: 'ap-northeast-1' });

/**
 * エラーメッセージの定義（日本語）
 * 要件12.5: 日本語でユーザーフレンドリーなエラーメッセージを提供
 */
const ERROR_MESSAGES = {
  INVALID_INPUT: '入力データが不正です',
  INVALID_MODE: '診断方針が不正です',
  NO_RESPONSES: '回答が必要です',
  NO_SERVICES: 'サービスリストが必要です',
  PARSE_ERROR: 'AI分析結果の解析に失敗しました',
  THROTTLING: 'リクエストが多すぎます。しばらく待ってから再試行してください',
  VALIDATION: '入力データが不正です',
  SERVICE_UNAVAILABLE: 'AIサービスが一時的に利用できません。しばらく待ってから再試行してください',
  ACCESS_DENIED: 'AIサービスへのアクセスが拒否されました',
  GENERAL: 'AI分析中にエラーが発生しました。もう一度お試しください',
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
        return ERROR_MESSAGES.GENERAL;
    }
  }
  return ERROR_MESSAGES.GENERAL;
}

export const handler: Schema['diagnostic']['functionHandler'] = async (event) => {
  const { mode, responses, services } = event.arguments;

  // 入力検証
  if (!mode || !responses || !services) {
    logError('diagnostic.handler', new Error('Invalid input'), { mode: !!mode, responses: !!responses, services: !!services });
    return {
      result: null,
      error: ERROR_MESSAGES.INVALID_INPUT,
    };
  }

  // modeの型検証
  const validModes = ['tech-fit', 'vibe-fit', 'adventure'];
  if (!validModes.includes(mode)) {
    logError('diagnostic.handler', new Error('Invalid mode'), { mode });
    return {
      result: null,
      error: ERROR_MESSAGES.INVALID_MODE,
    };
  }

  try {
    // JSON文字列をパース
    let parsedResponses: unknown[];
    let parsedServices: unknown[];
    
    try {
      parsedResponses = JSON.parse(responses);
      parsedServices = JSON.parse(services);
    } catch (parseError) {
      logError('diagnostic.handler.parseInput', parseError, { responses, services });
      return {
        result: null,
        error: ERROR_MESSAGES.INVALID_INPUT,
      };
    }

    if (!Array.isArray(parsedResponses) || parsedResponses.length === 0) {
      logError('diagnostic.handler', new Error('No responses provided'), { responsesCount: parsedResponses?.length });
      return {
        result: null,
        error: ERROR_MESSAGES.NO_RESPONSES,
      };
    }

    if (!Array.isArray(parsedServices) || parsedServices.length === 0) {
      logError('diagnostic.handler', new Error('No services provided'), { servicesCount: parsedServices?.length });
      return {
        result: null,
        error: ERROR_MESSAGES.NO_SERVICES,
      };
    }

    // プロンプトを構築（型アサーション）
    const prompt = buildDiagnosticPrompt(
      mode as 'tech-fit' | 'vibe-fit' | 'adventure', 
      parsedResponses as { questionId: string; answer: string | string[] }[], 
      parsedServices as { category: string; serviceName: string }[]
    );

    // Bedrock APIを呼び出し
    const command = new InvokeModelCommand({
      modelId: 'jp.anthropic.claude-sonnet-4-5-20250929-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    // レスポンスからテキストを抽出
    const responseText = responseBody.content[0].text;

    // JSONをパース
    let diagnosticData;
    try {
      // JSONブロックを抽出（```json ... ``` の形式に対応）
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       responseText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;
      diagnosticData = JSON.parse(jsonText);
    } catch (parseError) {
      logError('diagnostic.handler.parseResponse', parseError, { responseText });
      return {
        result: null,
        error: ERROR_MESSAGES.PARSE_ERROR,
      };
    }

    // 結果を構築
    const result = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      mode,
      service: diagnosticData.service,
      catchphrase: diagnosticData.catchphrase,
      aiLetter: diagnosticData.aiLetter,
      nextActions: diagnosticData.nextActions,
    };

    return {
      result: JSON.stringify(result),
      error: null,
    };
  } catch (error) {
    // エラーをログ出力
    logError('diagnostic.handler.bedrock', error);

    // ユーザー向けメッセージを取得
    const userMessage = getBedrockErrorMessage(error);

    return {
      result: null,
      error: userMessage,
    };
  }
};
