'use client';

import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-30">
      <div className="flex items-center justify-between h-full px-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
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
        <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Reflections
        </h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
