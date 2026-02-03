'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';
import PinScreen from '@/components/PinScreen';
import CoreValues from '@/components/CoreValues';
import { Entry } from '@/lib/types';

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      const response = await fetch('/api/entries');
      if (response.status === 401) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      if (response.ok) {
        setIsAuthenticated(true);
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

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    fetchEntries();
  };

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

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-gray-400 dark:text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PinScreen onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        entries={entries}
        selectedEntry={selectedEntry}
        isOpen={isSidebarOpen}
        onSelectEntry={handleSelectEntry}
        onDeleteEntry={handleDeleteEntry}
        onNewEntry={handleNewEntry}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-[250px]' : 'ml-0'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
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
      <CoreValues />
    </div>
  );
}
