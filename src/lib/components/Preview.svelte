<script lang="ts">
  import { documentStore } from '$lib/stores/document';
  import { onMount } from 'svelte';

  let rendered = '';
  let parser: any = null;

  onMount(async () => {
    try {
      // attempt to load wasm parser glue (if built)
      const mod = await import('$lib/wasm/markdown_parser.js');
      if (mod && mod.init) {
        await mod.init();
        parser = mod;
      }
    } catch (err) {
      // wasm not built yet; fall back to lightweight conversion
      parser = null;
    }

    documentStore.subscribe(doc => {
      if (parser && parser.parse_markdown) {
        rendered = parser.parse_markdown(doc.content);
      } else {
        // naive fallback: convert headings and paragraphs
        const html = doc.content
          .split('\n\n')
          .map(block => {
            if (block.startsWith('# ')) return `<h1>${block.replace('# ', '')}</h1>`;
            if (block.startsWith('## ')) return `<h2>${block.replace('## ', '')}</h2>`;
            return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
          })
          .join('');
        rendered = html;
      }
    });
  });
</script>

<style>
  .preview { padding: 1rem; }
</style>

<div class="preview">
  {@html rendered}
</div>
