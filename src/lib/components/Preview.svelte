<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { documentStore } from '$lib/stores/document';
  import { themeStore } from '$lib/stores/theme';
  import { loadMarkdownParser } from '$lib/wasm/markdown_parser';

  let rendered = '<p>Loading preview...</p>';
  let parser: { parse_markdown: (input: string) => string } | null = null;
  let unsubscribe: (() => void) | undefined;

  onMount(async () => {
    parser = await loadMarkdownParser();

    unsubscribe = documentStore.subscribe((doc) => {
      if (parser && parser.parse_markdown) {
        rendered = parser.parse_markdown(doc.content);
      } else {
        const html = doc.content
          .split('\n\n')
          .map((block) => {
            if (block.startsWith('# ')) return `<h1>${block.replace('# ', '')}</h1>`;
            if (block.startsWith('## ')) return `<h2>${block.replace('## ', '')}</h2>`;
            return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
          })
          .join('');
        rendered = html;
      }

      documentStore.updateRenderedHTML(rendered);
    });
  });

  onDestroy(() => {
    unsubscribe?.();
  });
</script>

<style>
  .preview {
    height: 100%;
    overflow: auto;
    padding: 1.2rem;
    background: var(--bg);
    color: var(--text);
    font-family: 'Atkinson Hyperlegible', 'Segoe UI', sans-serif;
    transition: background-color 160ms ease, color 160ms ease;
  }

  .preview :global(h1),
  .preview :global(h2),
  .preview :global(h3),
  .preview :global(h4),
  .preview :global(h5),
  .preview :global(h6) {
    color: var(--heading);
  }

  .preview :global(a) {
    color: var(--link);
  }

  .preview :global(pre),
  .preview :global(code) {
    background: var(--code-bg);
    color: var(--code-text);
  }
</style>

<div
  class="preview"
  style="--bg: {$themeStore.backgroundColor}; --text: {$themeStore.textColor}; --heading: {$themeStore.headingColor}; --link: {$themeStore.linkColor}; --code-bg: {$themeStore.codeBackground}; --code-text: {$themeStore.codeText};"
>
  {@html rendered}
</div>
