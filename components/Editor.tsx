'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Entry } from '@/lib/types';

interface EditorProps {
  entry: Entry | null;
  onSave: (title: string, content: string) => void;
  isSaving: boolean;
}

export default function Editor({ entry, onSave, isSaving }: EditorProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialTitle = useMemo(() => entry?.title ?? '', [entry?.id, entry?.title]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialContent = useMemo(() => entry?.content ?? '', [entry?.id, entry?.content]);

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [entryId, setEntryId] = useState(entry?.id);

  if (entry?.id !== entryId) {
    setEntryId(entry?.id);
    setTitle(entry?.title ?? '');
    setContent(entry?.content ?? '');
  }

  const hasChanges = title !== initialTitle || content !== initialContent;

  const handleSave = useCallback(() => {
    if (title.trim() || content.trim()) {
      onSave(title.trim() || 'Untitled', content);
    }
  }, [title, content, onSave]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {hasChanges ? 'Unsaved changes' : entry ? 'Saved' : 'New entry'}
        </span>
        <button
          onClick={handleSave}
          disabled={isSaving || (!title.trim() && !content.trim())}
          className="px-4 py-1.5 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full text-2xl font-medium bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 mb-4"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your thoughts..."
        className="w-full h-[calc(100vh-250px)] text-base bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 leading-relaxed"
      />
    </div>
  );
}
