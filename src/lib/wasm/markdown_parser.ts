type MarkdownParserModule = {
  parse_markdown: (input: string) => string;
  count_words: (input: string) => number;
  default?: (input?: unknown) => Promise<void>;
};

let parserModule: MarkdownParserModule | null = null;

export async function loadMarkdownParser(): Promise<MarkdownParserModule | null> {
  if (parserModule) {
    return parserModule;
  }

  try {
    const modulePath = './pkg/markdown_parser/markdown_parser.js';
    const mod = (await import(/* @vite-ignore */ modulePath)) as MarkdownParserModule;
    if (typeof mod.default === 'function') {
      await mod.default();
    }
    parserModule = mod;
    return parserModule;
  } catch {
    return null;
  }
}
