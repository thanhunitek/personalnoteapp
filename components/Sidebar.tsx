'use client';

import { Entry } from '@/lib/types';
import EntryItem from './EntryItem';

interface SidebarProps {
  entries: Entry[];
  selectedEntry: Entry | null;
  isOpen: boolean;
  onSelectEntry: (entry: Entry) => void;
  onDeleteEntry: (id: string) => void;
  onNewEntry: () => void;
}

export default function Sidebar({
  entries,
  selectedEntry,
  isOpen,
  onSelectEntry,
  onDeleteEntry,
  onNewEntry,
}: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ width: '250px' }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={onNewEntry}
            className="w-full py-2 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            New Entry
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              No entries yet. Start writing!
            </div>
          ) : (
            entries.map((entry) => (
              <EntryItem
                key={entry.id}
                entry={entry}
                isSelected={selectedEntry?.id === entry.id}
                onSelect={onSelectEntry}
                onDelete={onDeleteEntry}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
