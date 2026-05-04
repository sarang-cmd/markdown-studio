export function exportToMarkdown(content: string): Blob {
  return new Blob([content], { type: 'text/markdown;charset=utf-8' });
}
