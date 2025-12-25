# 設計書：AWS Identity Gift 2025

## 概要

AWS Identity Gift 2025は、Next.js 16とAWS Amplify Gen 2を使用して構築されるサーバーレスWebアプリケーションです。ユーザーの回答に基づいてAmazon Bedrock（Claude 4.5）がパーソナライズされたAWSサービスを推薦し、クリスマスをテーマにしたインタラクティブなUIで結果を提供します。

### 主要な設計決定

- **認証なし**: LocalStorageのみを使用し、データベースやユーザー管理は不要
- **サーバーレスアーキテクチャ**: Amplify Functionsを使用したLambdaベースのバックエンド
- **クライアント側状態管理**: React hooksとLocalStorageで完結
- **静的設問**: 各診断方針に対して事前定義された質問セット
- **動的OGP生成**: S3を使用せず、Lambda関数で画像を直接生成・返却

## アーキテクチャ

### システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                        ユーザー                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Frontend (App Router)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - トップページ（クリスマスツリー表示）              │  │
│  │  - 診断フロー（方針選択→質問→結果表示）            │  │
│  │  - LocalStorage管理（結果アーカイブ）               │  │
│  │  - アニメーション（降雪、ギフト開封）               │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Amplify Functions (Lambda)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  診断Function                                         │  │
│  │  - ユーザー回答を受信                                │  │
│  │  - Bedrock APIを呼び出し                             │  │
│  │  - 推薦結果を返却                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  OGP画像生成Function                                  │  │
│  │  - 診断結果IDを受信                                  │  │
│  │  - Canvas/Sharpで画像合成                            │  │
│  │  - 画像バイナリを直接返却                            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Amazon Bedrock (Claude 4.5)                     │
│  - Model ID: jp.anthropic.claude-sonnet-4-5-20250929-v1:0   │
│  - Region: ap-northeast-1                                    │
└─────────────────────────────────────────────────────────────┘
```

### データフロー

1. **診断フロー**:
   ```
   ユーザー → 方針選択 → 質問回答 → Frontend → Amplify Function 
   → Bedrock API → AI推薦 → Frontend → 結果表示 → LocalStorage保存
   ```

2. **アーカイブ表示フロー**:
   ```
   ページ読み込み → LocalStorage読み取り → ギフト画像表示 
   → ギフトクリック → 結果詳細表示
   ```

3. **ギフトカード画像生成フロー**:
   ```
   診断結果表示 → 自動的に画像生成開始 → Amplify Function 
   → Claude 4.5（ビジュアル生成） → Canvas（文字合成） → フロントエンドに返却
   → 結果画面に表示 → SNSシェア時にOGP画像として使用
   ```

## コンポーネントとインターフェース

### フロントエンドコンポーネント構造

```
app/
├── page.tsx                          # トップページ（ツリー＋アーカイブ表示）
├── diagnostic/
│   ├── page.tsx                      # 診断フローのメインページ
│   ├── components/
│   │   ├── ModeSelector.tsx          # 診断方針選択UI
│   │   ├── VolumeSelector.tsx        # クイック/詳細選択UI
│   │   ├── QuestionForm.tsx          # 質問表示＋回答入力
│   │   ├── ResultAnimation.tsx       # ギフト開封アニメーション
│   │   ├── ResultDisplay.tsx         # 診断結果表示
│   │   └── GiftCardGenerator.tsx     # ギフトカード画像生成＋表示
│   └── questions/
│       ├── tech-fit.ts               # Tech-Fit用設問データ
│       ├── vibe-fit.ts               # Vibe-Fit用設問データ
│       └── adventure.ts              # Adventure用設問データ
├── result/
│   └── [id]/
│       └── page.tsx                  # 個別結果ページ（OGP対応）
├── api/
│   └── gift-card/
│       └── route.ts                  # ギフトカード画像生成エンドポイント
└── components/
    ├── ChristmasTree.tsx             # ツリー表示コンポーネント
    ├── GiftArchive.tsx               # アーカイブギフト表示
    ├── SnowfallEffect.tsx            # 降雪エフェクト
    └── CreditFooter.tsx              # いらすとやクレジット表記
```

### バックエンド関数構造

```
amplify/
├── backend.ts                        # Amplifyバックエンド定義
├── functions/
│   ├── diagnostic/
│   │   ├── handler.ts                # 診断ロジック
│   │   ├── resource.ts               # Lambda設定
│   │   └── prompts.ts                # Claudeプロンプトテンプレート
│   └── gift-card/
│       ├── handler.ts                # ギフトカード画像生成ロジック
│       ├── resource.ts               # Lambda設定
│       └── templates/
│           └── card-template.ts      # 画像合成テンプレート
└── data/
    └── resource.ts                   # データスキーマ定義（診断Function用）
```

### 主要インターフェース

#### TypeScript型定義

```typescript
// 診断方針
type DiagnosticMode = 'tech-fit' | 'vibe-fit' | 'adventure';

// 質問ボリューム
type QuestionVolume = 'quick' | 'detailed';

// 質問タイプ
type QuestionType = 'multiple-choice' | 'free-text';

// 質問定義
interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];  // multiple-choiceの場合のみ
  required: boolean;
  volume: QuestionVolume;  // 'quick' | 'detailed'
}

// ユーザー回答
interface UserResponse {
  questionId: string;
  answer: string | string[];  // 単一選択 or 複数選択 or 自由記述
}

// 診断リクエスト
interface DiagnosticRequest {
  mode: DiagnosticMode;
  responses: UserResponse[];
}

// AWSサービス
interface AWSService {
  category: string;
  serviceName: string;
}

// 診断結果
interface DiagnosticResult {
  id: string;  // UUID
  timestamp: string;  // ISO 8601形式
  mode: DiagnosticMode;
  service: AWSService;
  catchphrase: string;
  aiLetter: string;
  nextActions: string[];
  giftCardImage?: string;  // Base64エンコードされた画像データ（オプション）
}

// ギフトカード画像生成リクエスト
interface GiftCardRequest {
  result: DiagnosticResult;
  userName?: string;  // オプション：ユーザー名を含める場合
}

// ギフトカード画像生成レスポンス
interface GiftCardResponse {
  imageData: string;  // Base64エンコードされた画像データ
  error?: string;
}

// LocalStorage保存形式
interface StoredResults {
  results: DiagnosticResult[];  // 最大9件
}
```

## データモデル

### サービスマスタ（CSV）

ファイルパス: `app/public/services.csv`

```csv
Category,ServiceName
分析,Amazon Athena
分析,Amazon Redshift
...
```

- **読み込み方法**: フロントエンドでfetch APIを使用して読み込み、診断Functionに渡す
- **フォーマット**: UTF-8エンコードのCSV
- **カラム**: Category（カテゴリ）、ServiceName（サービス名）

### LocalStorageスキーマ

キー: `aws-identity-gift-results`

```json
{
  "results": [
    {
      "id": "uuid-v4",
      "timestamp": "2025-12-25T10:30:00.000Z",
      "mode": "tech-fit",
      "service": {
        "category": "コンピューティング",
        "serviceName": "AWS Lambda"
      },
      "catchphrase": "あなたはサーバーレスの魔法使い",
      "aiLetter": "あなたの回答から...",
      "nextActions": [
        "AWS Lambda公式ドキュメントを読む",
        "サーバーレスアプリケーションを構築する"
      ]
    }
  ]
}
```

### 設問データ構造

各診断方針ごとに静的な設問セットを定義します。

#### Tech-Fit設問例

```typescript
export const techFitQuestions: Question[] = [
  // クイック（5問）
  {
    id: 'tf-q1',
    text: '最も得意なプログラミング言語は？',
    type: 'multiple-choice',
    options: ['Python', 'JavaScript/TypeScript', 'Java', 'Go', 'その他'],
    required: true,
    volume: 'quick'
  },
  {
    id: 'tf-q2',
    text: '普段どのようなアプリケーションを開発していますか？',
    type: 'multiple-choice',
    options: ['Webアプリ', 'モバイルアプリ', 'データ分析', 'インフラ/DevOps', 'その他'],
    required: true,
    volume: 'quick'
  },
  // ... 残り3問
  
  // 詳細（追加15問）
  {
    id: 'tf-q6',
    text: 'データベースの経験について教えてください',
    type: 'free-text',
    required: false,
    volume: 'detailed'
  },
  // ... 残り14問
];
```

## 正確性プロパティ

プロパティとは、システムのすべての有効な実行において真であるべき特性や動作のことです。これは、人間が読める仕様と機械で検証可能な正確性保証の橋渡しとなります。

### プロパティ1：診断方針の完全な提供

*すべての*診断インターフェースの読み込みにおいて、システムは3つの診断方針（Tech-Fit、Vibe-Fit、Adventure）すべてを表示し、ユーザーが正確に1つを選択できるようにする必要がある

**検証要件:** 要件1.2、1.3、1.4

### プロパティ2：方針選択時の設問セット読み込み

*すべての*診断方針選択において、システムは選択されたモードに対応する正しい設問セットを読み込む必要がある

**検証要件:** 要件1.5、3.1

### プロパティ3：質問ボリューム切り替え時の回答保持

*すべての*質問ボリューム切り替え操作において、既に回答された質問の内容は保持され、失われてはならない

**検証要件:** 要件2.5

### プロパティ4：必須質問の完全回答検証

*すべての*送信試行において、すべての必須質問（required: true）が回答されている場合にのみ、システムは診断リクエストを送信する

**検証要件:** 要件3.4

### プロパティ5：診断結果の完全性

*すべての*成功した診断において、返される結果にはサービス名、キャッチコピー、AIレター、ネクストアクション、タイムスタンプのすべてが含まれている必要がある

**検証要件:** 要件4.3、4.4、4.5、4.6、5.5

### プロパティ6：LocalStorageアーカイブの上限管理

*すべての*結果保存操作において、LocalStorageに保存される結果の数は最大9件を超えてはならず、10件目が追加される際は最も古い結果が自動的に削除される

**検証要件:** 要件6.4、6.5

### プロパティ7：結果保存時のタイムスタンプ付与

*すべての*診断結果保存において、結果にはISO 8601形式のタイムスタンプが含まれている必要がある

**検証要件:** 要件6.1、6.6

### プロパティ8：ギフト画像の循環使用

*すべての*アーカイブ結果表示において、ギフト画像は3種類（present、candy、socks）を順番に使用し、結果のインデックスを3で割った余りに基づいて決定される

**検証要件:** 要件7.3

### プロパティ9：ギフトクリック時の結果表示

*すべての*ギフトクリック操作において、システムはクリックされたギフトに対応する診断結果を正確に表示する必要がある

**検証要件:** 要件7.5

### プロパティ10：ギフトカード画像の自動生成

*すべての*診断結果表示において、システムは自動的にギフトカード画像の生成を開始し、完了後に結果画面に表示する必要がある

**検証要件:** 要件9.1、9.6

### プロパティ11：ギフトカード画像の文字情報分離

*すべての*ギフトカード画像生成において、Claude生成画像には文字情報が含まれず、サービス名とキャッチコピーはHTML/CSSで確実に重ね合わせられる必要がある

**検証要件:** 要件9.4、9.5

### プロパティ12：ギフトカード画像の非保存

*すべての*ギフトカード画像生成において、サーバー側で画像データを保存してはならず、生成後は即座にクライアントに返却される

**検証要件:** 要件9.8

### プロパティ11：ギフトカード画像の文字情報分離

*すべての*ギフトカード画像生成において、Claude生成画像には文字情報が含まれず、サービス名とキャッチコピーはHTML/CSSで確実に重ね合わせられる必要がある

**検証要件:** 要件9.4、9.5

### プロパティ12：ギフトカード画像の非保存

*すべての*ギフトカード画像生成において、サーバー側で画像データを保存してはならず、生成後は即座にクライアントに返却される

**検証要件:** 要件9.8

### プロパティ13：エラー時のコンソールログ出力

*すべての*エラー発生時において、システムはコンソールにエラー詳細をログ出力する必要がある

**検証要件:** 要件12.4

### プロパティ14：エラーメッセージの日本語表示

*すべての*ユーザー向けエラーメッセージにおいて、メッセージは日本語で表示される必要がある

**検証要件:** 要件12.5

## エラーハンドリング

### フロントエンドエラー処理

```typescript
// Bedrock API呼び出しエラー
try {
  const result = await invokeDiagnostic(request);
  // 成功処理
} catch (error) {
  if (error instanceof NetworkError) {
    showError('ネットワーク接続を確認してください');
  } else if (error instanceof BedrockError) {
    showError('AI分析中にエラーが発生しました。もう一度お試しください');
  } else {
    showError('予期しないエラーが発生しました');
  }
  console.error('Diagnostic error:', error);
}

// LocalStorageエラー
try {
  saveResult(result);
} catch (error) {
  if (error instanceof QuotaExceededError) {
    showError('ブラウザのストレージが満杯です。古い結果を削除してください');
  }
  console.error('LocalStorage error:', error);
}
```

### バックエンドエラー処理

```typescript
// Bedrock API呼び出しエラー
export const handler = async (event) => {
  try {
    const response = await bedrockClient.send(command);
    return { statusCode: 200, body: JSON.stringify(response) };
  } catch (error) {
    console.error('Bedrock invocation error:', error);
    
    if (error.name === 'ThrottlingException') {
      return {
        statusCode: 429,
        body: JSON.stringify({ error: 'リクエストが多すぎます。しばらく待ってから再試行してください' })
      };
    }
    
    if (error.name === 'ValidationException') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '入力データが不正です' })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'サーバーエラーが発生しました' })
    };
  }
};
```

## テスト戦略

### 単体テスト

**対象コンポーネント:**
- 質問フォームのバリデーションロジック
- LocalStorage操作（保存、読み取り、削除）
- ギフト画像選択ロジック
- 診断方針別の設問データ読み込み

**テストフレームワーク:** Vitest + React Testing Library

**テスト例:**
```typescript
describe('LocalStorage結果管理', () => {
  it('9件の結果を保存できる', () => {
    // テストロジック
  });
  
  it('10件目の結果追加時に最も古い結果が削除される', () => {
    // テストロジック
  });
});
```

### 統合テスト

**対象フロー:**
- 診断フロー全体（方針選択→質問回答→結果表示→保存）
- アーカイブ表示とクリック操作
- OGP画像生成エンドポイント

**テストフレームワーク:** Playwright

**テスト例:**
```typescript
test('Tech-Fitクイック診断フロー', async ({ page }) => {
  await page.goto('/');
  await page.click('text=診断を始める');
  await page.click('text=Tech-Fit');
  // 質問回答
  await page.click('text=送信');
  // 結果表示を確認
  await expect(page.locator('.result-display')).toBeVisible();
});
```

### プロパティベーステスト

プロパティベーステストは、多数の生成された入力に対して普遍的なプロパティを検証します。各プロパティは、すべての有効な入力に対して成立すべき形式的な仕様です。

**テストライブラリ:** fast-check（TypeScript用）

**テスト設定:**
- 各プロパティテストは最低100回の反復を実行
- 各テストは設計書のプロパティを参照するタグを含む

**テスト例:**

```typescript
import fc from 'fast-check';

// Feature: aws-identity-gift, Property 2: 質問ボリューム切り替えの状態保持
test('質問ボリューム切り替え時に回答が保持される', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({
        questionId: fc.string(),
        answer: fc.string()
      })),
      (responses) => {
        const state = { responses, volume: 'quick' };
        const newState = switchVolume(state, 'detailed');
        
        // すべての回答が保持されていることを確認
        return responses.every(r => 
          newState.responses.some(nr => 
            nr.questionId === r.questionId && nr.answer === r.answer
          )
        );
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: aws-identity-gift, Property 6: LocalStorageアーカイブの上限管理
test('LocalStorageは最大9件の結果を保持する', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({
        id: fc.uuid(),
        timestamp: fc.date().map(d => d.toISOString()),
        mode: fc.constantFrom('tech-fit', 'vibe-fit', 'adventure'),
        service: fc.record({
          category: fc.string(),
          serviceName: fc.string()
        }),
        catchphrase: fc.string(),
        aiLetter: fc.string(),
        nextActions: fc.array(fc.string())
      }), { minLength: 10, maxLength: 20 }),
      (results) => {
        const storage = new ResultStorage();
        results.forEach(r => storage.save(r));
        
        // 保存された結果が9件以下であることを確認
        const stored = storage.getAll();
        return stored.length <= 9;
      }
    ),
    { numRuns: 100 }
  );
});
```

## 実装の詳細

### Claudeプロンプト設計

```typescript
export function buildDiagnosticPrompt(
  mode: DiagnosticMode,
  responses: UserResponse[],
  services: AWSService[]
): string {
  const modeDescriptions = {
    'tech-fit': 'ユーザーの技術スキルと経験に基づいて',
    'vibe-fit': 'ユーザーの性格とライフスタイルに基づいて',
    'adventure': 'ユーザーの憧れと挑戦心に基づいて、意外性のある'
  };
  
  return `
あなたはAWSエンジニアのキャリアアドバイザーです。
以下のユーザー回答を分析し、${modeDescriptions[mode]}最適なAWSサービスを1つ推薦してください。

# ユーザー回答
${responses.map(r => `Q: ${r.questionId}\nA: ${r.answer}`).join('\n\n')}

# 選択可能なAWSサービス
${services.map(s => `- ${s.category}: ${s.serviceName}`).join('\n')}

# 出力形式（JSON）
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

重要: 必ず上記のJSON形式で出力してください。
`;
}
```

### ギフトカード画像生成実装

ギフトカード画像は、診断結果表示時に自動的に生成され、プレミア感を演出します。

```typescript
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { createCanvas, loadImage } from 'canvas';

const bedrockClient = new BedrockRuntimeClient({ region: 'ap-northeast-1' });

export async function generateGiftCard(result: DiagnosticResult, userName?: string): Promise<string> {
  // Step 1: Claude 4.5で画像生成
  const imagePrompt = `
${result.service.serviceName}を象徴する抽象的で美しいビジュアルイメージを生成してください。
このサービスの特徴: ${result.aiLetter}

重要: 画像には一切の文字やテキストを含めないでください。
視覚的な要素のみで表現してください。
クリスマスの雰囲気を感じさせる温かみのある色調で。
`;

  const imageCommand = new InvokeModelCommand({
    modelId: 'jp.anthropic.claude-sonnet-4-5-20250929-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: imagePrompt
        }
      ]
    })
  });

  const imageResponse = await bedrockClient.send(imageCommand);
  const imageData = JSON.parse(new TextDecoder().decode(imageResponse.body));
  
  // 生成された画像をBase64デコード
  const backgroundImage = Buffer.from(imageData.content[0].image, 'base64');
  
  // Step 2: HTML/CSSで文字情報を重ね合わせ
  const width = 1200;
  const height = 630;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // 背景画像を描画
  const bgImage = await loadImage(backgroundImage);
  ctx.drawImage(bgImage, 0, 0, width, height);
  
  // 半透明のオーバーレイ（文字を読みやすくするため）
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(0, 0, width, height);
  
  // ユーザー名（オプション）
  if (userName) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${userName}さんへ`, width / 2, 100);
  }
  
  // サービス名
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 60px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(result.service.serviceName, width / 2, height / 2 - 50);
  
  // キャッチコピー
  ctx.font = '40px sans-serif';
  ctx.fillText(result.catchphrase, width / 2, height / 2 + 50);
  
  // フッター
  ctx.font = '24px sans-serif';
  ctx.fillText('Your AWS Identity 2025', width / 2, height - 50);
  
  // Base64エンコードして返却
  return canvas.toBuffer('image/png').toString('base64');
}
```

**フロントエンド実装例:**

```typescript
// GiftCardGenerator.tsx
export function GiftCardGenerator({ result }: { result: DiagnosticResult }) {
  const [giftCardImage, setGiftCardImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  
  useEffect(() => {
    async function generateCard() {
      try {
        const response = await fetch('/api/gift-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ result })
        });
        
        const data = await response.json();
        setGiftCardImage(data.imageData);
      } catch (error) {
        console.error('Gift card generation error:', error);
      } finally {
        setIsGenerating(false);
      }
    }
    
    generateCard();
  }, [result]);
  
  if (isGenerating) {
    return (
      <div className="gift-card-loading">
        <div className="spinner" />
        <p>あなただけのギフトカードを生成しています...</p>
      </div>
    );
  }
  
  return (
    <div className="gift-card-container">
      {giftCardImage && (
        <>
          <img 
            src={`data:image/png;base64,${giftCardImage}`} 
            alt="Your AWS Identity Gift Card"
            className="gift-card-image"
          />
          <div className="share-message">
            <p>この画像は保存されておらず、今ここにしかないあなただけのものです。</p>
            <p>みんなに見せびらかしませんか？</p>
            <button onClick={handleShare} className="share-button">
              SNSでシェアする
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

**重要な設計決定:**
- **自動生成**: 診断結果表示時に自動的に画像生成を開始
- **プレミア感の演出**: 「今ここにしかない」というメッセージでSNSシェアを促進
- **文字情報の分離**: Claude生成画像には文字を含めず、Canvas APIで確実に付与
- **非保存**: サーバー側で画像を保存せず、Base64エンコードでクライアントに返却
- **OGP連携**: 生成済み画像をSNSシェア時のOGP画像として再利用

### アニメーション実装

```typescript
// ギフト開封アニメーション
export function GiftOpeningAnimation({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'shake' | 'open' | 'reveal'>('shake');
  
  useEffect(() => {
    const timer1 = setTimeout(() => setStage('open'), 1000);
    const timer2 = setTimeout(() => setStage('reveal'), 2000);
    const timer3 = setTimeout(() => onComplete(), 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);
  
  return (
    <div className={`gift-box ${stage}`}>
      {stage === 'reveal' ? (
        <div className="result-content">
          {/* 結果表示 */}
        </div>
      ) : (
        <img src="/christmas_gift1_present.png" alt="Gift" />
      )}
    </div>
  );
}
```

```css
/* アニメーションCSS */
.gift-box.shake {
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

.gift-box.open {
  animation: open 1s forwards;
}

@keyframes open {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(0); opacity: 0; }
}

.gift-box.reveal .result-content {
  animation: fadeIn 1s forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## デプロイメントとインフラ

### Amplify Gen 2設定

```typescript
// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { diagnostic } from './functions/diagnostic/resource';
import { giftCard } from './functions/gift-card/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  diagnostic,
  giftCard
});

// Bedrock呼び出し権限
backend.diagnostic.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['bedrock:InvokeModel'],
    resources: ['*']
  })
);

// ギフトカード画像生成用のBedrock権限
backend.giftCard.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['bedrock:InvokeModel'],
    resources: ['*']
  })
);
```

### 環境変数

```bash
# .env.local
NEXT_PUBLIC_AMPLIFY_REGION=ap-northeast-1
NEXT_PUBLIC_BEDROCK_MODEL_ID=jp.anthropic.claude-sonnet-4-5-20250929-v1:0
```

### デプロイコマンド

```bash
# サンドボックス環境
npm run amplify:sandbox

# 本番デプロイ
npm run amplify:deploy
```

## セキュリティ考慮事項

1. **個人情報の非収集**: ユーザー識別情報は一切収集しない
2. **LocalStorageのみ使用**: サーバー側にユーザーデータを保存しない
3. **Bedrock APIレート制限**: Lambda関数でスロットリング対策を実装
4. **OGP画像キャッシュ**: CloudFrontまたはブラウザキャッシュで過剰なLambda呼び出しを防止
5. **CORS設定**: 必要なオリジンのみ許可
6. **入力検証**: フロントエンドとバックエンドの両方で入力を検証
7. **データ取り扱いの透明性**: 
   - 質問回答画面に「入力されたデータはAI分析にのみ使用され、一切保存されません」と表示
   - トップページに「本サービスはユーザー識別情報を収集せず、すべてのデータはブラウザのLocalStorageにのみ保存されます」と表示
8. **AI生成コンテンツの免責**:
   - 診断結果画面に「この結果はAIで生成されたものであり、その信憑性についてはご自身でお確かめください」と表示
   - すべての免責表示を視認しやすい位置に配置

## パフォーマンス最適化

1. **画像最適化**: Next.js Image コンポーネントを使用
2. **コード分割**: 動的インポートで初期バンドルサイズを削減
3. **LocalStorage最適化**: 結果を9件に制限してストレージ使用量を管理
4. **Bedrock応答キャッシュ**: 同一入力に対する結果をクライアント側でキャッシュ（オプション）
5. **アニメーションパフォーマンス**: CSS transformとopacityのみ使用してGPUアクセラレーションを活用
