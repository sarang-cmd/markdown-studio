import { writable } from 'svelte/store';
import { loadLatestDocument, saveDocument } from '$lib/utils/storage';

export interface DocumentState {
  id: string;
  content: string;
  renderedHTML: string;
  wordCount: number;
  charCount: number;
  lastModified: string;
}

function createDocumentStore() {
  const initial: DocumentState = {
    id: crypto.randomUUID(),
    content: '# Welcome to Markdown Studio\n\nStart writing in the editor.\n\n- Live preview is powered by Rust + WebAssembly.\n- Theme colors update in real time.\n- Export supports HTML, Markdown, and PDF in the first phase.',
    renderedHTML: '',
    wordCount: 27,
    charCount: 197,
    lastModified: new Date().toISOString()
  };

  const { subscribe, update, set } = writable<DocumentState>(initial);

  void loadLatestDocument().then((doc) => {
    if (doc) {
      set(doc);
    }
  });

  return {
    subscribe,
    updateContent: (content: string) => update((d) => {
      const updated = {
        ...d,
        content,
        wordCount: content.split(/\s+/).filter(Boolean).length,
        charCount: content.length,
        lastModified: new Date().toISOString()
      };

      void saveDocument(updated);
      return updated;
    }),
    updateRenderedHTML: (renderedHTML: string) => update((d) => {
      const updated = { ...d, renderedHTML };
      void saveDocument(updated);
      return updated;
    }),
    set
  };
}

export const documentStore = createDocumentStore();
