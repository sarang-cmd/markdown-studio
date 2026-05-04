import { openDB } from 'idb';

export interface StoredDocument {
  id: string;
  content: string;
  renderedHTML: string;
  wordCount: number;
  charCount: number;
  lastModified: string;
}

const DB_NAME = 'markdown-studio';
const DB_VERSION = 1;
const DOC_STORE = 'documents';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(DOC_STORE)) {
      db.createObjectStore(DOC_STORE, { keyPath: 'id' });
    }
  }
});

export async function saveDocument(doc: StoredDocument): Promise<void> {
  const db = await dbPromise;
  await db.put(DOC_STORE, doc);
}

export async function loadDocument(id: string): Promise<StoredDocument | undefined> {
  const db = await dbPromise;
  return db.get(DOC_STORE, id);
}

export async function loadLatestDocument(): Promise<StoredDocument | undefined> {
  const db = await dbPromise;
  const tx = db.transaction(DOC_STORE, 'readonly');
  const store = tx.store;
  const all = await store.getAll();
  if (all.length === 0) {
    return undefined;
  }
  all.sort((a, b) => Date.parse(b.lastModified) - Date.parse(a.lastModified));
  return all[0];
}
