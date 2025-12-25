/**
 * Adventure診断用設問データ
 * 
 * 憧れと挑戦心に基づいてユーザーのアイデンティティを分析します。
 * クイック5問 + 詳細15問の合計20問で構成されています。
 */

import type { Question } from '../types';

export const adventureQuestions: Question[] = [
  // ========================================
  // クイック診断（5問、1分）
  // ========================================
  
  {
    id: 'ad-q1',
    text: 'もし制約がなければ、どんなプロジェクトに挑戦したいですか？',
    type: 'multiple-choice',
    options: [
      '世界中で使われるWebサービス',
      '最先端のAI・機械学習アプリ',
      'リアルタイムゲームやメタバース',
      'IoTやロボティクス',
      '社会課題を解決するシステム',
      '宇宙・科学技術関連',
      'その他の革新的なアイデア'
    ],
    multiple: true,  // 複数選択可能
    required: true,
    volume: 'quick'
  },
  
  {
    id: 'ad-q2',
    text: 'あなたが憧れる技術者・エンジニアのタイプは？',
    type: 'multiple-choice',
    options: [
      '新しい技術を生み出すイノベーター',
      '複雑な問題を解決するアーキテクト',
      '大規模システムを支えるインフラエンジニア',
      'ユーザー体験を追求するクリエイター',
      'データから価値を生み出すサイエンティスト',
      'セキュリティを守るスペシャリスト'
    ],
    multiple: true,  // 複数選択可能
    required: true,
    volume: 'quick'
  },
  
  {
    id: 'ad-q3',
    text: '今年、思い切って挑戦してみたいことは？',
    type: 'multiple-choice',
    options: [
      '資格取得やスキル認定',
      '個人プロダクトのリリース',
      '全く新しい技術スタックでの開発',
      '技術ブログや登壇での発信',
      'オープンソースへの貢献',
      'グローバルなコミュニティ参加',
      '起業や副業'
    ],
    multiple: true,  // 複数選択可能
    required: true,
    volume: 'quick'
  },
  
  {
    id: 'ad-q4',
    text: '「未来の自分」はどんな技術を使いこなしていると思いますか？',
    type: 'multiple-choice',
    options: [
      'AI・機械学習・生成AI',
      'クラウドネイティブ・サーバーレス',
      'ブロックチェーン・Web3',
      '量子コンピューティング',
      'AR/VR・メタバース',
      'エッジコンピューティング・IoT',
      'まだ存在しない新技術'
    ],
    multiple: true,  // 複数選択可能
    required: true,
    volume: 'quick'
  },
  
  {
    id: 'ad-q5',
    text: 'あなたにとって「冒険」とは？',
    type: 'multiple-choice',
    options: [
      '未知の技術領域に飛び込むこと',
      '大きな責任を持つプロジェクトを任されること',
      '失敗を恐れず新しいアイデアを試すこと',
      '自分の限界を超えて成長すること',
      '世界中の人々とコラボレーションすること'
    ],
    multiple: true,  // 複数選択可能
    required: true,
    volume: 'quick'
  },
  
  // ========================================
  // 詳細診断（追加15問、合計20問）
  // ========================================
  
  {
    id: 'ad-q6',
    text: 'もし1年間、好きなことだけに集中できるとしたら何をしますか？',
    type: 'free-text',
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q7',
    text: '技術トレンドの中で、最もワクワクするものは？',
    type: 'multiple-choice',
    options: [
      '生成AI（ChatGPT、画像生成など）',
      'サーバーレスアーキテクチャ',
      'エッジコンピューティング',
      'リアルタイム通信・WebRTC',
      'マイクロサービス・分散システム',
      'DevOps・Platform Engineering',
      'データエンジニアリング・ビッグデータ',
      'セキュリティ・ゼロトラスト'
    ],
    multiple: true,  // 複数選択可能
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q8',
    text: 'グローバルに活躍することに興味はありますか？',
    type: 'multiple-choice',
    options: [
      '日本で活躍したい',
      'あまり興味がない',
      'どちらでもない',
      '興味がある、リモートで国際チームと働きたい',
      '非常に興味がある、海外で働きたい'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q9',
    text: '技術コミュニティでの活動に興味はありますか？',
    type: 'multiple-choice',
    options: [
      '一人で学ぶ方が好き',
      'あまり興味がない',
      'どちらでもない',
      '興味があり、参加してみたい',
      '既に積極的に活動している'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q10',
    text: 'スタートアップや新規事業に興味はありますか？',
    type: 'multiple-choice',
    options: [
      '安定した環境が好き',
      'あまり興味がない',
      'どちらでもない',
      '興味がある、参加してみたい',
      '非常に興味がある、起業したい'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q11',
    text: 'あなたが「これだけは譲れない」技術的な信念はありますか？',
    type: 'free-text',
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q12',
    text: '失敗を恐れずに挑戦できますか？',
    type: 'multiple-choice',
    options: [
      '失敗は避けたい',
      'やや恐れる、慎重に進む',
      'どちらでもない',
      'やや恐れるが、挑戦する',
      '全く恐れない、失敗は学びの機会'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q13',
    text: '技術書や技術ブログをどのくらい読みますか？',
    type: 'multiple-choice',
    options: [
      'あまり読まない',
      'たまに',
      '月に数回',
      '週に数回',
      'ほぼ毎日'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q14',
    text: 'あなたが影響を受けた技術者や著名人はいますか？',
    type: 'free-text',
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q15',
    text: '大規模なシステムやサービスを作ることに憧れますか？',
    type: 'multiple-choice',
    options: [
      '小さくても価値あるものを作りたい',
      'あまり憧れない',
      'どちらでもない',
      'やや憧れる',
      '非常に憧れる'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q16',
    text: '技術的な負債にどう向き合いますか？',
    type: 'multiple-choice',
    options: [
      '新しいものを作る方が好き',
      'あまり気にしない',
      'どちらでもない',
      '必要に応じて対応する',
      '積極的にリファクタリングする'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q17',
    text: 'もし魔法が使えたら、どんな技術的課題を一瞬で解決したいですか？',
    type: 'free-text',
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q18',
    text: 'レガシーシステムのモダナイゼーションに興味はありますか？',
    type: 'multiple-choice',
    options: [
      '新しいものを作る方が好き',
      'あまり興味がない',
      'どちらでもない',
      'やや興味がある',
      '非常に興味がある、挑戦したい'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q19',
    text: 'あなたが技術で実現したい「夢」を教えてください',
    type: 'free-text',
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'ad-q20',
    text: '10年後、あなたはどんな「伝説」を残していたいですか？',
    type: 'free-text',
    required: false,
    volume: 'detailed'
  }
];

/**
 * クイック診断用の質問のみを取得
 */
export const getQuickQuestions = (): Question[] => {
  return adventureQuestions.filter(q => q.volume === 'quick');
};

/**
 * 詳細診断用の質問（クイック + 詳細）を取得
 */
export const getDetailedQuestions = (): Question[] => {
  return adventureQuestions;
};

/**
 * 質問IDから質問を取得
 */
export const getQuestionById = (id: string): Question | undefined => {
  return adventureQuestions.find(q => q.id === id);
};
