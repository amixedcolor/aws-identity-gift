# Claude Chat with AWS Amplify Gen2

AWS Amplify Gen2とAWS Bedrockを使用したシンプルなチャットアプリケーション。

## 機能

- Claude Sonnet 4.5による推論
- 認証機能（AWS Cognito）
- シンプルなUI
- エラーメッセージの表示

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. Amplify Sandboxの起動:
```bash
npm run amplify:sandbox
```

3. 別のターミナルでNext.jsの起動:
```bash
npm run dev
```

4. ブラウザで http://localhost:3000 を開く

## 必要な権限

Lambda関数がBedrockを呼び出すため、以下のIAM権限が必要です:
- `bedrock:InvokeModel`

これは `amplify/backend.ts` で自動的に設定されます。

## 使い方

1. サインアップ/サインイン
2. テキストエリアに質問を入力
3. 「送信」ボタンをクリック
4. Claude Sonnetからの回答が表示されます

## アーキテクチャ

- **Frontend**: Next.js 16 (App Router) + React 19
- **Backend**: AWS Amplify Gen2
- **Auth**: Amazon Cognito
- **AI**: Amazon Bedrock (Claude Sonnet 4.5)
- **Function**: AWS Lambda
