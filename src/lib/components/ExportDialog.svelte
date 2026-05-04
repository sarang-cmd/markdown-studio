<script lang="ts">
  import JSZip from 'jszip';
  import { documentStore } from '$lib/stores/document';
  import { themeStore } from '$lib/stores/theme';
  import { exportToHTML } from '$lib/utils/exporters/html';
  import { exportToPDF } from '$lib/utils/exporters/pdf';
  import { exportToDOCX } from '$lib/utils/exporters/docx';
  import { exportToMarkdown } from '$lib/utils/exporters/markdown';

  export let open = false;
  export let onClose: () => void;

  let selectedFormats = {
    pdf: true,
    docx: false,
    html: true,
    markdown: true
  };

  let metadata = {
    title: 'Markdown Studio Export',
    author: '',
    pageSize: 'a4' as 'a4' | 'letter'
  };

  let exporting = false;

  async function handleExport() {
    exporting = true;
    try {
      const doc = $documentStore;
      const theme = $themeStore;
      const files: { blob: Blob; name: string }[] = [];

      if (selectedFormats.pdf) {
        files.push({
          blob: await exportToPDF(doc.renderedHTML || doc.content, metadata),
          name: 'document.pdf'
        });
      }

      if (selectedFormats.docx) {
        files.push({ blob: await exportToDOCX(doc.content), name: 'document.docx' });
      }

      if (selectedFormats.html) {
        files.push({ blob: exportToHTML(doc.renderedHTML || doc.content, theme), name: 'document.html' });
      }

      if (selectedFormats.markdown) {
        files.push({ blob: exportToMarkdown(doc.content), name: 'document.md' });
      }

      if (files.length === 1) {
        downloadBlob(files[0].blob, files[0].name);
      } else if (files.length > 1) {
        const zip = new JSZip();
        files.forEach((file) => zip.file(file.name, file.blob));
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadBlob(zipBlob, 'markdown-studio-export.zip');
      }

      onClose?.();
    } finally {
      exporting = false;
    }
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }
</script>

{#if open}
  <div class="overlay" role="presentation">
    <dialog open>
      <h3>Export Document</h3>
      <section>
        <label><input type="checkbox" bind:checked={selectedFormats.pdf} /> PDF</label>
        <label><input type="checkbox" bind:checked={selectedFormats.docx} /> DOCX</label>
        <label><input type="checkbox" bind:checked={selectedFormats.html} /> HTML</label>
        <label><input type="checkbox" bind:checked={selectedFormats.markdown} /> Markdown</label>
      </section>

      <section class="meta">
        <input type="text" placeholder="Title" bind:value={metadata.title} />
        <input type="text" placeholder="Author" bind:value={metadata.author} />
        <select bind:value={metadata.pageSize}>
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
        </select>
      </section>

      <footer>
        <button on:click={() => onClose?.()} disabled={exporting}>Cancel</button>
        <button class="primary" on:click={handleExport} disabled={exporting}>
          {#if exporting}Exporting...{:else}Export{/if}
        </button>
      </footer>
    </dialog>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(2, 6, 23, 0.45);
    display: grid;
    place-items: center;
  }

  dialog {
    width: min(92vw, 460px);
    border: none;
    border-radius: 0.8rem;
    padding: 1rem;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.25);
  }

  h3 {
    margin: 0 0 0.75rem;
  }

  section {
    display: grid;
    gap: 0.45rem;
    margin-bottom: 0.75rem;
  }

  .meta input,
  .meta select {
    border: 1px solid #cbd5e1;
    border-radius: 0.45rem;
    padding: 0.45rem 0.6rem;
  }

  footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  button {
    border: 1px solid #cbd5e1;
    background: white;
    border-radius: 0.45rem;
    padding: 0.45rem 0.75rem;
    cursor: pointer;
  }

  .primary {
    background: #165dff;
    border-color: #165dff;
    color: white;
  }
</style>
