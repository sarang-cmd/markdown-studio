<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { settingsStore } from '$lib/stores/settings';

  const dispatch = createEventDispatcher<{
    openExport: void;
    togglePalette: void;
    toggleTheme: void;
  }>();
</script>

<header class="toolbar">
  <div class="brand">
    <span class="dot"></span>
    <h1>Markdown Studio</h1>
  </div>
  <div class="actions">
    <button on:click={() => dispatch('togglePalette')}>Palette</button>
    <button on:click={() => dispatch('toggleTheme')}>Theme</button>
    <button on:click={() => settingsStore.toggleFocusMode()}>Focus</button>
    <button class="primary" on:click={() => dispatch('openExport')}>Export</button>
  </div>
</header>

<style>
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: #0b1320;
    color: #eff6ff;
    border-bottom: 1px solid #1f2937;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.55rem;
  }

  h1 {
    margin: 0;
    font-size: 1.05rem;
    letter-spacing: 0.02em;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: linear-gradient(135deg, #14b8a6, #f97316);
    display: inline-block;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  button {
    border: 1px solid #374151;
    color: #dbeafe;
    background: #111827;
    border-radius: 0.5rem;
    padding: 0.45rem 0.75rem;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .primary {
    background: #f97316;
    border-color: #fb923c;
    color: #0b1320;
    font-weight: 600;
  }
</style>
