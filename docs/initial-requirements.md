# 要件定義書：AWSクリスマスプレゼント診断ツール
**「あなたの代名詞（になるかもしれない）」AWSサービスをプレゼントしよう**

---

## 1. プロジェクト概要
### 1.1 コンセプト
AWSエンジニア（特に若手層）に向けて、その人のスキル・性格・憧れに基づいた「自分を象徴するAWSサービス」をAIが診断し、クリスマスプレゼントとして贈るWebアプリケーション。

### 1.2 解決したい課題
- AWSサービスが多すぎて、自分の強みや「推し」が定まっていないエンジニアが多い。
- 自分の技術的な方向性やアイデンティティを見つけるきっかけが不足している。

### 1.3 提供価値
- 100種類のサービスから、AIによるパーソナライズされた「代名詞」の提案。
- クリスマスらしい情緒的な演出による、自己肯定感と技術への興味向上。
- 診断結果の視覚的アーカイブとSNSシェアによるコミュニティ活性化。

---

## 2. ユーザー体験 (UX) 仕様
### 2.1 診断フロー
1.  **トップ画面:** クリスマスツリーが中央に配置されたモダンなUI。
    - ツリーの画像は `app/public/christmas_tree.png` を使用
2.  **診断開始:** ログイン不要で即座に開始。
3.  **方針選択:** 以下3つから1つを選択。
    - **Tech-Fit (スキル・経験重視):** 既存の技術スタックから強みを分析。
    - **Vibe-Fit (性格・ライフスタイル重視):** 価値観や日常の癖から相性を分析。
    - **Adventure (憧れ・意外性重視):** 挑戦心や未来像からニッチなサービスを提案。
4.  **ボリューム選択:** 「1分（クイック/5問）」または「5分（詳細/20問）」がある。デフォルトでクイックで進み、クイックの質問が終了したタイミングで、送信か、詳細に進むか選べる。詳細に進んだ後は、「やっぱりやめてクイック時点で送信」も可能。
5.  **回答入力:** 方針別の静的設問（選択肢＋自由記述）に回答。
6.  **結果発表:** プレゼントボックスが揺れ、光とともに開封されるアニメーション。
7.  **アーカイブ:** 診断結果がLocalStorageに保存され、ツリーの周りにギフトが増えていく。
    - ギフトの画像は以下3つを順番に使用する。9つまで保存可能で、10個目からは、1つ目だった一番古いものから削除されていく。削除されたら、新しいものは末尾に追加で、1つ目だったプレゼントが消える。ギフトの配置は、ランダム性を持たせつつも静的に指定する。
      - `app/public/christmas_gift1_present.png`
      - `app/public/christmas_gift2_candy.png`
      - `app/public/christmas_gift3_socks.png`

### 2.2 アウトプット内容
- **サービス名:** 100種類のマスタから選定された1つ。
- **キャッチコピー:** ユーザーの属性を捉えた短いフレーズ。
- **AIレター:** 「なぜあなたにこのギフトを贈ったのか」を綴ったパーソナライズ文（Claude 4.5生成）。
- **ネクストアクション:** サービス習得への具体的な第一歩。
- **タイムスタンプ:** 診断実施日時。

---

## 3. 機能要件
### 3.1 診断エンジン
- **AIモデル:** Claude Sonnet 4.5。（Model ID: `jp.anthropic.claude-sonnet-4-5-20250929-v1:0` 、 Region: `ap-northeast-1` ）
- **ロジック:** 選択された方針と設問回答をコンテキストとして入力。100個のAWSサービスリストから最適解を推論。
- **設問:** 方針ごとに最適化された静的な設問セット（合計45問＋共通5問）。

### 3.2 データ保存
- **LocalStorage管理:** - ログイン不要、DB不要。
    - セッションを跨いで複数回の診断結果を配列として保持。
    - ブラウザキャッシュクリアまで永続化（数日間保持を想定）。

### 3.3 動的OGP画像生成（S3レス）
- **生成方式:** SNSクローラーのアクセス時にLambda（Amplify Function）でオンザフライ生成。
- **合成内容:** - 背景：Claude 4.5による各サービスイメージ画像（またはアセット）。
    - 重ね合わせ：サービス名、キャッチコピー等をHTML/Canvasライブラリで合成。
- **配信方式:** ストレージ（S3）を介さず、HTTPレスポンスとして画像バイナリを直接返却。

### 3.4 クレジット表記
- 画像はいらすとやを使用しているので、「いらすとや」と表記する

---

## 4. 非機能要件
### 4.1 UI/UX デザイン
- **フレームワーク:** Tailwind CSS ＋ 生のCSS（アニメーション用）。
- **ビジュアル:** クリスマスレッド・グリーン・ゴールドを基調としたグラデーション。
- **演出効果:**
    - 降雪エフェクト。
    - プレゼントボックスのホバー・クリックアニメーション。
    - 診断結果アーカイブ（ツリーの下にランダムに配置されるギフト）。

### 4.2 技術スタック
- **Frontend:** React / Next.js (Amplify Gen 2)
- **Backend:** Amplify Functions (Lambda)
- **AI API:** Amazon Bedrock (Claude 4.5)
- **Infrastructure:** AWS (Managed via Amplify)

---

## 5. サービスマスタ
AWSの全ての23カテゴリ（ソース: https://docs.aws.amazon.com/ja_jp/whitepapers/latest/aws-overview/amazon-web-services-cloud-platform.html ）から、主要サービスとニッチサービスをバランスよく配置。

```csv
Category,ServiceName
分析,Amazon Athena
分析,Amazon Redshift
分析,Amazon EMR
分析,Amazon Kinesis
分析,AWS Glue
分析,Amazon OpenSearch Service
分析,Amazon MSK
分析,Amazon QuickSight
アプリケーション統合,Amazon SQS
アプリケーション統合,Amazon SNS
アプリケーション統合,AWS Step Functions
アプリケーション統合,Amazon EventBridge
アプリケーション統合,AWS AppSync
アプリケーション統合,Amazon MQ
ブロックチェーン,Amazon Managed Blockchain
ブロックチェーン,Amazon Managed Blockchain (AMB) Access
ブロックチェーン,Amazon Managed Blockchain (AMB) Query
ビジネスアプリケーション,Amazon Connect
ビジネスアプリケーション,Amazon Chime
ビジネスアプリケーション,Amazon Wickr
ビジネスアプリケーション,Amazon Pinpoint
クラウド財務管理,AWS Cost Explorer
クラウド財務管理,AWS Budgets
クラウド財務管理,AWS Compute Optimizer
クラウド財務管理,AWS Billing Conductor
コンピューティング,Amazon EC2
コンピューティング,AWS Lambda
コンピューティング,AWS Fargate
コンピューティング,AWS App Runner
コンピューティング,AWS Batch
コンピューティング,Amazon Lightsail
コンピューティング,AWS Outposts
Customer Enablement,AWS Support
Customer Enablement,AWS IQ
Customer Enablement,AWS Managed Services (AMS)
コンテナ,Amazon ECS
コンテナ,Amazon EKS
コンテナ,Amazon ECR
コンテナ,AWS App2Container
データベース,Amazon RDS
データベース,Amazon Aurora
データベース,Amazon DynamoDB
データベース,Amazon ElastiCache
データベース,Amazon Neptune
データベース,Amazon Timestream
データベース,Amazon DocumentDB
データベース,Amazon Keyspaces
デベロッパーツール,AWS CodePipeline
デベロッパーツール,AWS CodeBuild
デベロッパーツール,AWS CodeDeploy
デベロッパーツール,AWS Cloud9
デベロッパーツール,AWS X-Ray
デベロッパーツール,AWS AppConfig
デベロッパーツール,AWS CloudShell
エンドユーザーコンピューティング,Amazon WorkSpaces
エンドユーザーコンピューティング,Amazon AppStream 2.0
エンドユーザーコンピューティング,Amazon WorkDocs
エンドユーザーコンピューティング,Amazon WorkSpaces Web
フロントエンドウェブおよびモバイル,AWS Amplify
フロントエンドウェブおよびモバイル,AWS Device Farm
フロントエンドウェブおよびモバイル,AWS AppSync (Frontend focus)
ゲームテクノロジー,Amazon GameLift
ゲームテクノロジー,Open 3D Engine
ゲームテクノロジー,Amazon GameSparks
IoT,AWS IoT Core
IoT,AWS IoT Greengrass
IoT,AWS IoT Analytics
IoT,AWS IoT Events
IoT,AWS IoT SiteWise
Machine Learning (ML) と人工知能 (AI),Amazon SageMaker
Machine Learning (ML) と人工知能 (AI),Amazon Bedrock
Machine Learning (ML) と人工知能 (AI),Amazon Rekognition
Machine Learning (ML) と人工知能 (AI),Amazon Polly
Machine Learning (ML) と人工知能 (AI),Amazon Lex
Machine Learning (ML) と人工知能 (AI),Amazon Comprehend
Machine Learning (ML) と人工知能 (AI),Amazon Textract
Machine Learning (ML) と人工知能 (AI),Amazon Kendra
マネジメントとガバナンス,Amazon CloudWatch
マネジメントとガバナンス,AWS CloudTrail
マネジメントとガバナンス,AWS Config
マネジメントとガバナンス,AWS Systems Manager
マネジメントとガバナンス,AWS Organizations
マネジメントとガバナンス,AWS Control Tower
マネジメントとガバナンス,AWS CloudFormation
マネジメントとガバナンス,AWS Proton
メディア,AWS Elemental MediaLive
メディア,AWS Elemental MediaConvert
メディア,AWS Elemental MediaPackage
メディア,Amazon Interactive Video Service (IVS)
メディア,AWS Elemental Appliances
移行と転送,AWS Migration Hub
移行と転送,AWS Database Migration Service (DMS)
移行と転送,AWS Snowball
移行と転送,AWS Transfer Family
移行と転送,AWS DataSync
ネットワークとコンテンツ配信,Amazon VPC
ネットワークとコンテンツ配信,Amazon Route 53
ネットワークとコンテンツ配信,Amazon CloudFront
ネットワークとコンテンツ配信,Amazon API Gateway
ネットワークとコンテンツ配信,AWS Direct Connect
ネットワークとコンテンツ配信,AWS Global Accelerator
ネットワークとコンテンツ配信,Amazon Verified Access
量子テクノロジー,Amazon Braket
量子テクノロジー,Amazon Braket Hybrid Jobs
量子テクノロジー,Amazon Braket Simulators
Satellite,AWS Ground Station
Satellite,AWS Ground Station Data Delivery
Satellite,AWS Ground Station Wideband
セキュリティ、アイデンティティ、コンプライアンス,AWS IAM
セキュリティ、アイデンティティ、コンプライアンス,Amazon Cognito
セキュリティ、アイデンティティ、コンプライアンス,Amazon GuardDuty
セキュリティ、アイデンティティ、コンプライアンス,Amazon Inspector
セキュリティ、アイデンティティ、コンプライアンス,Amazon Macie
セキュリティ、アイデンティティ、コンプライアンス,AWS WAF
セキュリティ、アイデンティティ、コンプライアンス,AWS Shield
セキュリティ、アイデンティティ、コンプライアンス,AWS KMS
セキュリティ、アイデンティティ、コンプライアンス,AWS Secrets Manager
セキュリティ、アイデンティティ、コンプライアンス,AWS Artifact
ストレージ,Amazon S3
ストレージ,Amazon EBS
ストレージ,Amazon EFS
ストレージ,Amazon FSx
ストレージ,AWS Storage Gateway
ストレージ,AWS Backup
```

---

## 6. セキュリティ・制約事項
- ユーザー識別情報は収集せず、LocalStorageのみで完結。
- 生成AIのハルシネーション（誤情報）対策として、サービスURL等は静的なリンクを付与。
- クローラーによるLambdaの過剰呼び出しを防ぐため、シンプルなキャッシュヘッダーを設定。