'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';
import { Entry } from '@/lib/types';

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const response = await fetch('/api/entries');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleNewEntry = () => {
    setSelectedEntry(null);
  };

  const handleSelectEntry = (entry: Entry) => {
    setSelectedEntry(entry);
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEntry?.id === id) {
          setSelectedEntry(null);
        }
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleSave = async (title: string, content: string) => {
    setIsSaving(true);
    try {
      if (selectedEntry) {
        const response = await fetch(`/api/entries/${selectedEntry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
          const updated = await response.json();
          setEntries((prev) =>
            prev.map((e) => (e.id === updated.id ? updated : e))
          );
          setSelectedEntry(updated);
        }
      } else {
        const response = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
          const created = await response.json();
          setEntries((prev) => [created, ...prev]);
          setSelectedEntry(created);
        }
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      <Sidebar
        entries={entries}
        selectedEntry={selectedEntry}
        isOpen={isSidebarOpen}
        onSelectEntry={handleSelectEntry}
        onDeleteEntry={handleDeleteEntry}
        onNewEntry={handleNewEntry}
      />
      <main
        className={`pt-14 transition-all duration-300 ${
          isSidebarOpen ? 'ml-[250px]' : 'ml-0'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-56px)]">
            <div className="text-gray-400 dark:text-gray-500">Loading...</div>
          </div>
        ) : (
          <Editor
            entry={selectedEntry}
            onSave={handleSave}
            isSaving={isSaving}
          />
        )}
      </main>
    </div>
  );
}
