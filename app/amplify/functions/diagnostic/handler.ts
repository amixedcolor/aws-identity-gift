import type { Schema } from '../../data/resource';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { buildDiagnosticPrompt } from './prompts';

const client = new BedrockRuntimeClient({ region: 'ap-northeast-1' });

export const handler: Schema['diagnostic']['functionHandler'] = async (event) => {
  const { mode, responses, services } = event.arguments;

  // 入力検証
  if (!mode || !responses || !services) {
    console.error('Invalid input:', { mode, responses, services });
    return {
      result: null,
      error: '入力データが不正です',
    };
  }

  // modeの型検証
  const validModes = ['tech-fit', 'vibe-fit', 'adventure'];
  if (!validModes.includes(mode)) {
    console.error('Invalid mode:', mode);
    return {
      result: null,
      error: '診断方針が不正です',
    };
  }

  try {
    // JSON文字列をパース
    const parsedResponses = JSON.parse(responses);
    const parsedServices = JSON.parse(services);

    if (!Array.isArray(parsedResponses) || parsedResponses.length === 0) {
      console.error('No responses provided');
      return {
        result: null,
        error: '回答が必要です',
      };
    }

    if (!Array.isArray(parsedServices) || parsedServices.length === 0) {
      console.error('No services provided');
      return {
        result: null,
        error: 'サービスリストが必要です',
      };
    }

    // プロンプトを構築（型アサーション）
    const prompt = buildDiagnosticPrompt(mode as 'tech-fit' | 'vibe-fit' | 'adventure', parsedResponses, parsedServices);

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
      console.error('JSON parse error:', parseError, 'Response:', responseText);
      return {
        result: null,
        error: 'AI分析結果の解析に失敗しました',
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
    console.error('Bedrock invocation error:', error);

    // エラータイプに応じた処理
    if (error && typeof error === 'object' && 'name' in error) {
      const errorName = (error as { name: string }).name;

      if (errorName === 'ThrottlingException') {
        return {
          result: null,
          error: 'リクエストが多すぎます。しばらく待ってから再試行してください',
        };
      }

      if (errorName === 'ValidationException') {
        return {
          result: null,
          error: '入力データが不正です',
        };
      }
    }

    return {
      result: null,
      error: 'AI分析中にエラーが発生しました。もう一度お試しください',
    };
  }
};
