import { Redis } from '@upstash/redis';
import { Entry, EntryInput } from './types';
import { v4 as uuidv4 } from 'uuid';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

const ENTRIES_KEY = 'entries';

export async function getAllEntries(): Promise<Entry[]> {
  const entries = await redis.hgetall<Record<string, Entry>>(ENTRIES_KEY);
  if (!entries) return [];

  return Object.values(entries).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getEntry(id: string): Promise<Entry | null> {
  const entry = await redis.hget<Entry>(ENTRIES_KEY, id);
  return entry;
}

export async function createEntry(input: EntryInput): Promise<Entry> {
  const now = new Date().toISOString();
  const entry: Entry = {
    id: uuidv4(),
    title: input.title,
    content: input.content,
    createdAt: now,
    updatedAt: now,
  };

  await redis.hset(ENTRIES_KEY, { [entry.id]: entry });
  return entry;
}

export async function updateEntry(id: string, input: EntryInput): Promise<Entry | null> {
  const existing = await getEntry(id);
  if (!existing) return null;

  const updated: Entry = {
    ...existing,
    title: input.title,
    content: input.content,
    updatedAt: new Date().toISOString(),
  };

  await redis.hset(ENTRIES_KEY, { [id]: updated });
  return updated;
}

export async function deleteEntry(id: string): Promise<boolean> {
  const result = await redis.hdel(ENTRIES_KEY, id);
  return result === 1;
}
