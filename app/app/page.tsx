'use client';

import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await client.queries.chat({ prompt });
      
      if (result.data?.error) {
        setError(result.data.error);
      } else if (result.data?.response) {
        setResponse(result.data.response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 dark:text-white">
            Claude Chat
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="質問を入力してください..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-indigo-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 resize-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="mt-3 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
          >
            {loading ? '処理中...' : '送信'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-lg mb-6">
            <p className="text-red-800 dark:text-red-200 font-medium">エラー:</p>
            <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
        )}

        {response && (
          <div className="p-6 bg-white dark:bg-zinc-900 border-2 border-indigo-200 dark:border-zinc-700 rounded-lg shadow-lg">
            <p className="text-indigo-900 dark:text-indigo-300 font-medium mb-2">回答:</p>
            <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
              {response}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
