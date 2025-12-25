/**
 * Tech-Fit診断用設問データ
 * 
 * スキルと経験に基づいてユーザーの技術的アイデンティティを分析します。
 * クイック5問 + 詳細15問の合計20問で構成されています。
 */

import type { Question } from '../types';

export const techFitQuestions: Question[] = [
  // ========================================
  // クイック診断（5問、1分）
  // ========================================
  
  {
    id: 'tf-q1',
    text: '最も得意なプログラミング言語は？',
    type: 'multiple-choice',
    options: [
      'Python',
      'JavaScript/TypeScript',
      'Java',
      'Go',
      'C#/.NET',
      'Ruby',
      'PHP',
      'その他'
    ],
    required: true,
    volume: 'quick'
  },
  
  {
    id: 'tf-q2',
    text: '普段どのようなアプリケーションを開発していますか？',
    type: 'multiple-choice',
    options: [
      'Webアプリケーション',
      'モバイルアプリ',
      'データ分析・機械学習',
      'インフラ・DevOps',
      'IoT・組み込み',
      'ゲーム開発',
      'その他'
    ],
    required: true,
    volume: 'quick'
  },
  
  {
    id: 'tf-q3',
    text: 'AWSの利用経験はどのくらいですか？',
    type: 'multiple-choice',
    options: [
      '初めて触る',
      '数ヶ月程度',
      '1〜2年',
      '3年以上',
      '5年以上のベテラン'
    ],
    required: true,
    volume: 'quick'
  },
  
  {
    id: 'tf-q4',
    text: '開発で最も重視することは？',
    type: 'multiple-choice',
    options: [
      'スピード・俊敏性',
      'コスト効率',
      'セキュリティ',
      'スケーラビリティ',
      '保守性・可読性',
      'パフォーマンス'
    ],
    required: true,
    volume: 'quick'
  },
  
  {
    id: 'tf-q5',
    text: 'チーム開発での役割は？',
    type: 'multiple-choice',
    options: [
      'フロントエンド開発',
      'バックエンド開発',
      'フルスタック開発',
      'インフラ・SRE',
      'データエンジニア',
      'アーキテクト',
      '個人開発者'
    ],
    required: true,
    volume: 'quick'
  },
  
  // ========================================
  // 詳細診断（追加15問、合計20問）
  // ========================================
  
  {
    id: 'tf-q6',
    text: 'データベースの経験について教えてください（使用したDB、用途など）',
    type: 'free-text',
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q7',
    text: 'コンテナ技術（Docker、Kubernetesなど）の利用経験は？',
    type: 'multiple-choice',
    options: [
      '使ったことがない',
      'Dockerを少し使ったことがある',
      'Docker/Docker Composeを日常的に使う',
      'Kubernetesも使いこなせる',
      'ECS/EKSで本番運用している'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q8',
    text: 'サーバーレスアーキテクチャに興味はありますか？',
    type: 'multiple-choice',
    options: [
      '従来のサーバー管理が好き',
      'あまり興味がない',
      'どちらでもない',
      'やや興味がある',
      '非常に興味がある'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q9',
    text: 'CI/CDパイプラインの構築経験は？',
    type: 'multiple-choice',
    options: [
      '経験なし',
      'GitHub Actionsなどを少し使った',
      'チームで運用している',
      '自分で設計・構築できる',
      '複雑なパイプラインを最適化できる'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q10',
    text: 'APIの設計・開発で好きなスタイルは？',
    type: 'multiple-choice',
    options: [
      'まだ決まっていない',
      'REST API',
      'GraphQL',
      'gRPC',
      'WebSocket'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q11',
    text: '監視・ログ管理についてどう考えていますか？',
    type: 'multiple-choice',
    options: [
      'まだよくわからない',
      'あまり気にしていない',
      'ある程度必要',
      '非常に重要だと思う'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q12',
    text: 'セキュリティ対策で実践していることは？（複数選択可）',
    type: 'multiple-choice',
    options: [
      'まだ実践していない',
      'IAMロールとポリシーの適切な設定',
      'MFA（多要素認証）の有効化',
      'データの暗号化（保存時・転送時）',
      'セキュリティグループの最小権限設定',
      'ログ監視とアラート設定',
      '定期的な脆弱性スキャン',
      'シークレット管理（Secrets Manager等）'
    ],
    multiple: true,  // 複数選択可能
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q13',
    text: 'インフラをコード化（IaC）する経験は？',
    type: 'multiple-choice',
    options: [
      '経験なし',
      'CloudFormation/Terraformを少し触った',
      'チームで使っている',
      '自分で設計・管理できる',
      'CDKなど高度なツールも使いこなす'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q14',
    text: 'マイクロサービスアーキテクチャについてどう思いますか？',
    type: 'multiple-choice',
    options: [
      'まだよくわからない',
      'モノリスの方が好き',
      '適切な場面で使いたい',
      '積極的に採用したい'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q15',
    text: 'キャッシュ戦略について考えたことはありますか？',
    type: 'multiple-choice',
    options: [
      'まだ経験がない',
      'あまり意識していない',
      '基本的なキャッシュは使う',
      'よく考えて実装している'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q16',
    text: 'メッセージキュー（SQS、Kafkaなど）の利用経験は？',
    type: 'multiple-choice',
    options: [
      '初めて聞いた',
      '概念は知っているが使ったことはない',
      '開発環境で試したことがある',
      '本番環境で運用している'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q17',
    text: 'あなたが最近解決した技術的な課題を教えてください',
    type: 'free-text',
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q18',
    text: 'パフォーマンスチューニングの経験は？',
    type: 'multiple-choice',
    options: [
      'まだ学習中',
      'あまり経験がない',
      '必要に応じて対応する',
      '頻繁に行っている'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q19',
    text: 'AIや機械学習に興味はありますか？',
    type: 'multiple-choice',
    options: [
      '全く興味がない',
      'あまり興味がない',
      'やや興味がある',
      '興味があり、学習中',
      '非常に興味があり、実装経験もある'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'tf-q20',
    text: '2026年に挑戦したい技術領域は？',
    type: 'free-text',
    required: false,
    volume: 'detailed'
  }
];

/**
 * クイック診断用の質問のみを取得
 */
export const getQuickQuestions = (): Question[] => {
  return techFitQuestions.filter(q => q.volume === 'quick');
};

/**
 * 詳細診断用の質問（クイック + 詳細）を取得
 */
export const getDetailedQuestions = (): Question[] => {
  return techFitQuestions;
};

/**
 * 質問IDから質問を取得
 */
export const getQuestionById = (id: string): Question | undefined => {
  return techFitQuestions.find(q => q.id === id);
};
