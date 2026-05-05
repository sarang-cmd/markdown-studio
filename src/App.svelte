<script lang="ts">
  import Toolbar from '$lib/components/Toolbar.svelte';
  import Editor from '$lib/components/Editor.svelte';
  import Preview from '$lib/components/Preview.svelte';
  import ColorPalette from '$lib/components/ColorPalette.svelte';
  import ThemeBuilder from '$lib/components/ThemeBuilder.svelte';
  import WritingStats from '$lib/components/WritingStats.svelte';
  import ExportDialog from '$lib/components/ExportDialog.svelte';
  import { settingsStore } from '$lib/stores/settings';

  let showPalette = true;
  let showTheme = true;
  let showExport = false;
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
    grid-template-columns: 1fr auto 1fr auto auto;
  }

  .pane {
    min-width: 0;
    min-height: 0;
    background: white;
  }

  .divider {
    width: 1px;
    background: #e2e8f0;
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
    }
  }
</style>

<div class="page" class:focus={$settingsStore.focusMode}>
  <Toolbar
    on:openExport={() => (showExport = true)}
    on:togglePalette={() => (showPalette = !showPalette)}
    on:toggleTheme={() => (showTheme = !showTheme)}
  />

  <div class="workspace">
    <section class="pane"><Editor /></section>
    <div class="divider"></div>
    <section class="pane"><Preview /></section>
    <ColorPalette open={showPalette} />
    <ThemeBuilder open={showTheme} />
  </div>

  <footer class="status">
    <WritingStats />
  </footer>

  <ExportDialog open={showExport} onClose={() => (showExport = false)} />
</div>
