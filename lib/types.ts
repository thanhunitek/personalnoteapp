export interface Entry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntryInput {
  title: string;
  content: string;
}
