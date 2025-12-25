# AWS Identity Gift 2025 - Library Documentation

## Overview

This directory contains the core type definitions and utility functions for the AWS Identity Gift 2025 application.

## Files

### `types.ts`

Contains all TypeScript type definitions for the application:

- **DiagnosticMode**: 診断方針 (tech-fit, vibe-fit, adventure)
- **QuestionVolume**: 質問ボリューム (quick, detailed)
- **QuestionType**: 質問タイプ (multiple-choice, free-text)
- **Question**: 質問定義
- **UserResponse**: ユーザー回答
- **DiagnosticRequest**: 診断リクエスト
- **AWSService**: AWSサービス
- **DiagnosticResult**: 診断結果
- **GiftCardRequest**: ギフトカード画像生成リクエスト
- **GiftCardResponse**: ギフトカード画像生成レスポンス
- **StoredResults**: LocalStorage保存形式

### `services.ts`

Service master CSV file utilities:

#### Functions

- **`loadServiceMaster()`**: CSVファイルからサービスマスタを読み込む
- **`parseServicesCSV(csvText: string)`**: CSV文字列をパース
- **`groupServicesByCategory(services: AWSService[])`**: カテゴリ別にグループ化
- **`findServiceByName(services: AWSService[], serviceName: string)`**: サービス名で検索
- **`filterServicesByCategory(services: AWSService[], category: string)`**: カテゴリでフィルタリング
- **`formatServicesForPrompt(services: AWSService[])`**: Claudeプロンプト用にフォーマット

#### Usage Example

```typescript
import { loadServiceMaster, formatServicesForPrompt } from '@/lib/services';

// Load service master
const services = await loadServiceMaster();

// Format for Claude prompt
const promptText = formatServicesForPrompt(services);
```

## Testing

Tests are located in `__tests__/services.test.ts`.

Run tests with:
```bash
npm test
```

## Requirements Validation

This implementation satisfies the following requirements:

- **要件 10.1**: サービスマスタ（services.csv）の読み込みユーティリティを実装
- **要件 10.5**: サービスマスタを診断エンジンで利用可能にする

All type definitions from the design document have been implemented with proper Japanese documentation.
