'use client';

import { Entry } from '@/lib/types';
import EntryItem from './EntryItem';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  entries: Entry[];
  selectedEntry: Entry | null;
  isOpen: boolean;
  onSelectEntry: (entry: Entry) => void;
  onDeleteEntry: (id: string) => void;
  onNewEntry: () => void;
  onToggleSidebar: () => void;
}

export default function Sidebar({
  entries,
  selectedEntry,
  isOpen,
  onSelectEntry,
  onDeleteEntry,
  onNewEntry,
  onToggleSidebar,
}: SidebarProps) {
  return (
    <>
      {/* Toggle button - visible when sidebar is closed */}
      <button
        onClick={onToggleSidebar}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Open sidebar"
      >
        <svg
          className="w-6 h-6 text-gray-700 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <aside
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '250px' }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close sidebar"
              >
                <svg
                  className="w-5 h-5 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <ThemeToggle />
            </div>
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
    </>
  );
}
