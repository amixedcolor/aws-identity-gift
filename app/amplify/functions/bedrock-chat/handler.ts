import type { Schema } from '../../data/resource';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({ region: 'ap-northeast-1' });

export const handler: Schema['chat']['functionHandler'] = async (event) => {
  const { prompt } = event.arguments;

  if (!prompt) {
    return {
      response: '',
      error: 'プロンプトが必要です',
    };
  }

  try {
    const command = new InvokeModelCommand({
      modelId: 'jp.anthropic.claude-sonnet-4-5-20250929-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1024,
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

    return {
      response: responseBody.content[0].text,
      error: null,
    };
  } catch (error) {
    console.error('Bedrock error:', error);
    return {
      response: '',
      error: error instanceof Error ? error.message : 'エラーが発生しました',
    };
  }
};
