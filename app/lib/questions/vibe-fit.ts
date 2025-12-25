/**
 * Vibe-Fit診断用設問データ
 * 
 * 性格とライフスタイルに基づいてユーザーのアイデンティティを分析します。
 * クイック5問 + 詳細15問の合計20問で構成されています。
 */

import type { Question } from '../types';

export const vibeFitQuestions: Question[] = [
  // ========================================
  // クイック診断（5問、1分）
  // ========================================
  
  {
    id: 'vf-q1',
    text: '仕事のスタイルはどちらに近いですか？',
    type: 'multiple-choice',
    options: [
      '計画的にコツコツ進める',
      '直感的にスピード重視',
      '柔軟に状況に応じて変える',
      'チームで協力しながら進める',
      '一人で集中して取り組む'
    ],
    required: true,
    volume: 'quick'
  },
  
  {
    id: 'vf-q2',
    text: '新しい技術に出会ったとき、どう感じますか？',
    type: 'multiple-choice',
    options: [
      'すぐに試してみたくなる',
      'まずは情報収集してから',
      '必要になったら学ぶ',
      '安定した技術の方が好き',
      'トレンドは常にチェックしている'
    ],
    required: true,
    volume: 'quick'
  },
  
  {
    id: 'vf-q3',
    text: '休日の過ごし方は？',
    type: 'multiple-choice',
    options: [
      '技術書を読んだり、コードを書く',
      'アウトドアやスポーツを楽しむ',
      '友人や家族と過ごす',
      'のんびり休息する',
      '趣味や副業に没頭する',
      '新しい場所を探索する'
    ],
    multiple: true,  // 複数選択可能
    required: true,
    volume: 'quick'
  },
  
  {
    id: 'vf-q4',
    text: 'あなたの性格を一言で表すと？',
    type: 'multiple-choice',
    options: [
      '冒険家・チャレンジャー',
      '職人・こだわり派',
      '調整役・サポーター',
      '革新者・アイデアマン',
      '安定志向・堅実派',
      '自由人・マイペース'
    ],
    required: true,
    volume: 'quick'
  },
  
  {
    id: 'vf-q5',
    text: '理想の働き方は？',
    type: 'multiple-choice',
    options: [
      'リモートワークで自由に',
      'オフィスでチームと協力',
      'カフェやコワーキングスペース',
      'フレックスタイムで柔軟に',
      '決まった時間・場所で規則正しく'
    ],
    required: true,
    volume: 'quick'
  },
  
  // ========================================
  // 詳細診断（追加15問、合計20問）
  // ========================================
  
  {
    id: 'vf-q6',
    text: 'ストレスを感じるのはどんな時ですか？',
    type: 'multiple-choice',
    options: [
      '締め切りに追われる時',
      '単調な作業が続く時',
      'コミュニケーションがうまくいかない時',
      '自分のペースで進められない時',
      '新しいことに挑戦する時',
      'あまりストレスを感じない'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q7',
    text: '朝型ですか？夜型ですか？',
    type: 'multiple-choice',
    options: [
      '完全に朝型',
      'どちらかといえば朝型',
      'どちらでもない',
      'どちらかといえば夜型',
      '完全に夜型'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q8',
    text: 'コーヒーやお茶など、好きな飲み物は？',
    type: 'multiple-choice',
    options: [
      'コーヒー（ブラック）',
      'コーヒー（ラテやカプチーノ）',
      '紅茶',
      '緑茶',
      'エナジードリンク',
      '水・ミネラルウォーター',
      'その他'
    ],
    multiple: true,  // 複数選択可能
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q9',
    text: '音楽を聴きながら作業しますか？',
    type: 'multiple-choice',
    options: [
      'いつも聴いている',
      'よく聴く',
      'たまに聴く',
      'あまり聴かない',
      '完全に静かな環境が好き'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q10',
    text: 'デスク環境はどんな感じですか？',
    type: 'multiple-choice',
    options: [
      'ミニマル・シンプル',
      'ガジェットや小物がたくさん',
      '植物やインテリアで癒し空間',
      'ホワイトボードやメモでアイデア満載',
      '特にこだわりはない'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q11',
    text: '問題解決のアプローチは？',
    type: 'multiple-choice',
    options: [
      'まず全体像を把握してから',
      'とりあえず手を動かしてみる',
      '誰かに相談しながら進める',
      'ドキュメントを徹底的に読む',
      '過去の経験から類推する'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q12',
    text: 'チームでの役割は？',
    type: 'multiple-choice',
    options: [
      'リーダー・まとめ役',
      'アイデアを出す人',
      '実装を進める人',
      'サポート・フォロー役',
      '一人で黙々と作業する人'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q13',
    text: '失敗したとき、どう対応しますか？',
    type: 'multiple-choice',
    options: [
      'すぐに原因を分析して改善',
      '一旦落ち着いてから考える',
      '誰かに相談する',
      '次に活かせればOK',
      'あまり気にしない'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q14',
    text: 'モチベーションの源は？',
    type: 'multiple-choice',
    options: [
      '新しいことを学ぶこと',
      '問題を解決すること',
      'チームの成功',
      '自分の成長',
      '社会への貢献',
      '報酬や評価'
    ],
    multiple: true,  // 複数選択可能
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q15',
    text: 'ドキュメントを書くのは好きですか？',
    type: 'multiple-choice',
    options: [
      '大好き、丁寧に書く',
      'まあまあ好き',
      'どちらでもない',
      'あまり好きではない',
      '苦手、最小限にしたい'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q16',
    text: 'あなたの「こだわり」を教えてください',
    type: 'free-text',
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q17',
    text: '完璧主義ですか？',
    type: 'multiple-choice',
    options: [
      '非常に完璧主義',
      'やや完璧主義',
      'どちらでもない',
      'あまり気にしない',
      '完成させることが最優先'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q18',
    text: '変化をどう捉えますか？',
    type: 'multiple-choice',
    options: [
      '変化は大歓迎',
      '変化は楽しい',
      'どちらでもない',
      '変化は少し不安',
      '安定が一番'
    ],
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q19',
    text: 'あなたにとって「成功」とは？',
    type: 'free-text',
    required: false,
    volume: 'detailed'
  },
  
  {
    id: 'vf-q20',
    text: '5年後、どんな自分でいたいですか？',
    type: 'free-text',
    required: false,
    volume: 'detailed'
  }
];

/**
 * クイック診断用の質問のみを取得
 */
export const getQuickQuestions = (): Question[] => {
  return vibeFitQuestions.filter(q => q.volume === 'quick');
};

/**
 * 詳細診断用の質問（クイック + 詳細）を取得
 */
export const getDetailedQuestions = (): Question[] => {
  return vibeFitQuestions;
};

/**
 * 質問IDから質問を取得
 */
export const getQuestionById = (id: string): Question | undefined => {
  return vibeFitQuestions.find(q => q.id === id);
};
