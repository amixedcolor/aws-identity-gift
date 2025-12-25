/**
 * Claudeプロンプトテンプレート
 * 診断方針別のプロンプトを生成します
 */

interface UserResponse {
  questionId: string;
  answer: string | string[];
}

interface AWSService {
  category: string;
  serviceName: string;
}

type DiagnosticMode = 'tech-fit' | 'vibe-fit' | 'adventure';

/**
 * 診断方針の説明
 */
const MODE_DESCRIPTIONS: Record<DiagnosticMode, string> = {
  'tech-fit': 'ユーザーの技術スキルと経験に基づいて',
  'vibe-fit': 'ユーザーの性格とライフスタイルに基づいて',
  'adventure': 'ユーザーの憧れと挑戦心に基づいて、意外性のある',
};

/**
 * 診断方針別の追加指示
 */
const MODE_INSTRUCTIONS: Record<DiagnosticMode, string> = {
  'tech-fit': `
- ユーザーの技術的な強みや経験を活かせるサービスを選んでください
- 実務で使えるサービスを優先してください
- ユーザーのスキルレベルに合ったサービスを選んでください`,
  'vibe-fit': `
- ユーザーの性格や価値観に合うサービスを選んでください
- ユーザーのライフスタイルや働き方に合うサービスを選んでください
- ユーザーの好みや興味に合うサービスを選んでください`,
  'adventure': `
- ユーザーがまだ触れたことのないサービスを選んでください
- ユーザーの憧れや挑戦心を刺激するサービスを選んでください
- 意外性があり、新しい発見があるサービスを選んでください`,
};

/**
 * 診断プロンプトを構築
 */
export function buildDiagnosticPrompt(
  mode: DiagnosticMode,
  responses: UserResponse[],
  services: AWSService[]
): string {
  // 回答を整形
  const formattedResponses = responses
    .map((r) => {
      const answer = Array.isArray(r.answer) ? r.answer.join(', ') : r.answer;
      return `質問ID: ${r.questionId}\n回答: ${answer}`;
    })
    .join('\n\n');

  // サービスリストを整形
  const formattedServices = services
    .map((s) => `- ${s.category}: ${s.serviceName}`)
    .join('\n');

  return `
あなたはAWSエンジニアのキャリアアドバイザーです。
以下のユーザー回答を分析し、${MODE_DESCRIPTIONS[mode]}最適なAWSサービスを1つ推薦してください。

# ユーザー回答
${formattedResponses}

# 選択可能なAWSサービス
${formattedServices}

# 診断方針: ${mode}
${MODE_INSTRUCTIONS[mode]}

# 出力形式（JSON）
必ず以下のJSON形式で出力してください。JSONブロック以外の説明文は不要です。

\`\`\`json
{
  "service": {
    "category": "カテゴリ名",
    "serviceName": "サービス名"
  },
  "catchphrase": "ユーザーを表す短いキャッチコピー（15文字以内）",
  "aiLetter": "なぜこのサービスを贈ったのかを説明する温かいメッセージ（200文字程度）",
  "nextActions": [
    "具体的な学習ステップ1",
    "具体的な学習ステップ2",
    "具体的な学習ステップ3"
  ]
}
\`\`\`

重要な注意事項:
1. 必ず上記のJSON形式で出力してください
2. serviceは必ず「選択可能なAWSサービス」リストから正確に1つ選んでください
3. catchphraseは15文字以内で、ユーザーの特徴を表現してください
4. aiLetterは200文字程度で、温かく親しみやすい文体で書いてください
5. nextActionsは3つの具体的なアクションステップを提供してください
6. すべての文章は日本語で書いてください
`.trim();
}
