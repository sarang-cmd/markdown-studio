<script lang="ts">
  import { onMount } from 'svelte';
  import Toolbar from '$lib/components/Toolbar.svelte';
  import Editor from '$lib/components/Editor.svelte';
  import Preview from '$lib/components/Preview.svelte';
  import ColorPalette from '$lib/components/ColorPalette.svelte';
  import ThemeBuilder from '$lib/components/ThemeBuilder.svelte';
  import WritingStats from '$lib/components/WritingStats.svelte';
  import ExportDialog from '$lib/components/ExportDialog.svelte';
  import { documentStore } from '$lib/stores/document';
  import { settingsStore } from '$lib/stores/settings';

  const PANE_KEY = 'markdown-studio-pane-size';

  let showPalette = true;
  let showTheme = true;
  let showExport = false;
  let editorPaneSize = 50;
  let workspaceHost: HTMLDivElement;
  let fileInput: HTMLInputElement;

  onMount(() => {
    const persisted = localStorage.getItem(PANE_KEY);
    if (persisted) {
      const value = Number.parseFloat(persisted);
      if (!Number.isNaN(value) && value >= 30 && value <= 70) {
        editorPaneSize = value;
      }
    }
  });

  function onDividerPointerDown(event: PointerEvent) {
    if (window.matchMedia('(max-width: 960px)').matches) {
      return;
    }

    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      if (!workspaceHost) {
        return;
      }

      const bounds = workspaceHost.getBoundingClientRect();
      const rawPercent = ((moveEvent.clientX - bounds.left) / bounds.width) * 100;
      editorPaneSize = Math.max(30, Math.min(70, rawPercent));
      localStorage.setItem(PANE_KEY, editorPaneSize.toFixed(2));
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }

  async function importDocument(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const content = await file.text();
    documentStore.updateContent(content);
    input.value = '';
  }
</script>

<style>
  .page {
    height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    background: radial-gradient(circle at 20% -10%, #fff7ed, transparent 28%),
      radial-gradient(circle at 100% 0, #eff6ff, transparent 30%),
      #f8fafc;
  }

  .workspace {
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(280px, var(--editor-pane-size)) 8px minmax(280px, 1fr) auto auto;
  }

  .pane {
    min-width: 0;
    min-height: 0;
    background: white;
  }

  .divider {
    width: 8px;
    background: #e2e8f0;
    cursor: col-resize;
    touch-action: none;
    border-left: 1px solid #cbd5e1;
    border-right: 1px solid #cbd5e1;
  }

  .status {
    border-top: 1px solid #e2e8f0;
    background: #ffffffcc;
    backdrop-filter: blur(4px);
    display: flex;
    gap: 1rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.83rem;
    color: #334155;
  }

  .focus .pane:last-of-type {
    opacity: 0.4;
    filter: grayscale(0.2);
  }

  @media (max-width: 960px) {
    .workspace {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1px 1fr;
    }

    .divider {
      width: 100%;
      height: 1px;
      cursor: default;
    }
  }
</style>

<div class="page" class:focus={$settingsStore.focusMode}>
  <Toolbar
    on:openExport={() => (showExport = true)}
    on:togglePalette={() => (showPalette = !showPalette)}
    on:toggleTheme={() => (showTheme = !showTheme)}
    on:importDocument={() => fileInput.click()}
  />

  <input bind:this={fileInput} type="file" accept=".md,.txt,text/markdown,text/plain" style="display:none" on:change={importDocument} />

  <div class="workspace" bind:this={workspaceHost} style="--editor-pane-size: {editorPaneSize}%">
    <section class="pane"><Editor /></section>
    <div class="divider" role="separator" aria-label="Resize panes" on:pointerdown={onDividerPointerDown}></div>
    <section class="pane"><Preview /></section>
    <ColorPalette open={showPalette} />
    <ThemeBuilder open={showTheme} />
  </div>

  <footer class="status">
    <WritingStats />
  </footer>

  <ExportDialog open={showExport} onClose={() => (showExport = false)} />
</div>
