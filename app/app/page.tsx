'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

export default function Home() {
  const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([]);
  const [content, setContent] = useState('');
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    return () => subscription.unsubscribe();
  }, []);

  async function createTodo() {
    if (!content.trim()) return;
    await client.models.Todo.create({
      content,
      isDone: false,
    });
    setContent('');
  }

  async function deleteTodo(id: string) {
    await client.models.Todo.delete({ id });
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            My Todos
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {user?.signInDetails?.loginId}
            </span>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createTodo()}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-white"
          />
          <button
            onClick={createTodo}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 rounded shadow"
            >
              <span className="text-black dark:text-white">{todo.content}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
