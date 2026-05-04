<script lang="ts">
  import { presetThemes, themeStore } from '$lib/stores/theme';

  export let open = false;

  const editableKeys = [
    'backgroundColor',
    'textColor',
    'headingColor',
    'linkColor',
    'codeBackground',
    'codeText',
    'accentColor'
  ] as const;

  const labels: Record<(typeof editableKeys)[number], string> = {
    backgroundColor: 'Background',
    textColor: 'Text',
    headingColor: 'Headings',
    linkColor: 'Links',
    codeBackground: 'Code Bg',
    codeText: 'Code Text',
    accentColor: 'Accent'
  };
</script>

{#if open}
  <aside class="panel">
    <h3>Theme Builder</h3>
    <div class="preset-grid">
      {#each presetThemes as theme}
        <button class="preset" on:click={() => themeStore.setTheme(theme)}>{theme.name}</button>
      {/each}
    </div>

    <div class="controls">
      {#each editableKeys as key}
        <label>
          <span>{labels[key]}</span>
          <input
            type="color"
            value={$themeStore[key]}
            on:input={(event) => themeStore.updateColor(key, (event.currentTarget as HTMLInputElement).value)}
          />
        </label>
      {/each}
    </div>
  </aside>
{/if}

<style>
  .panel {
    padding: 0.8rem;
    border-left: 1px solid #d1d5db;
    background: #fafafa;
    min-width: 260px;
  }

  h3 {
    margin: 0 0 0.8rem;
    font-size: 0.95rem;
  }

  .preset-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-bottom: 0.9rem;
  }

  .preset {
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 0.5rem;
    padding: 0.4rem 0.5rem;
    cursor: pointer;
    font-size: 0.8rem;
  }

  .controls {
    display: grid;
    gap: 0.55rem;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8rem;
  }
</style>
