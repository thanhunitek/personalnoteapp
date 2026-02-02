'use client';

import { Entry } from '@/lib/types';

interface EntryItemProps {
  entry: Entry;
  isSelected: boolean;
  onSelect: (entry: Entry) => void;
  onDelete: (id: string) => void;
}

export default function EntryItem({
  entry,
  isSelected,
  onSelect,
  onDelete,
}: EntryItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className={`group p-3 cursor-pointer border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
        isSelected ? 'bg-gray-100 dark:bg-gray-800' : ''
      }`}
      onClick={() => onSelect(entry)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
            {entry.title || 'Untitled'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(entry.updatedAt)}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(entry.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          aria-label="Delete entry"
        >
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
