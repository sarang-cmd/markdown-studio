<script lang="ts">
  import { paletteStore } from '$lib/stores/palette';
  import { rgbToHex } from '$lib/utils/colorUtils';
  import { loadColorExtractor } from '$lib/wasm/color_extractor';

  export let open = false;
  let busy = false;

  async function onFileChange(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) {
      return;
    }

    busy = true;
    try {
      const mod = await loadColorExtractor();
      const bytes = new Uint8Array(await file.arrayBuffer());

      if (!mod) {
        paletteStore.addPalette('Fallback Palette', ['#111827', '#2563EB', '#14B8A6', '#F97316', '#EAB308']);
        return;
      }

      const colors = mod.extract_palette(bytes, 6);
      const hex = colors.map((c) => (typeof c.hex === 'function' ? c.hex() : rgbToHex(c.r, c.g, c.b)));
      paletteStore.addPalette(file.name, hex);
    } finally {
      busy = false;
      target.value = '';
    }
  }
</script>

{#if open}
  <aside class="panel">
    <h3>Color Palette Generator</h3>
    <label class="upload">
      <input type="file" accept="image/png,image/jpeg" on:change={onFileChange} disabled={busy} />
      {#if busy}Extracting...{:else}Upload Image{/if}
    </label>

    <div class="palette-list">
      {#each $paletteStore.palettes as palette}
        <article>
          <h4>{palette.name}</h4>
          <div class="swatches">
            {#each palette.colors as color}
              <button
                style={`background:${color}`}
                title={color}
                on:click={() => navigator.clipboard.writeText(color)}
              ></button>
            {/each}
          </div>
        </article>
      {/each}
    </div>
  </aside>
{/if}

<style>
  .panel {
    padding: 0.8rem;
    border-left: 1px solid #d1d5db;
    background: #f9fafb;
    min-width: 260px;
  }

  h3 {
    margin: 0 0 0.6rem;
    font-size: 0.95rem;
  }

  .upload {
    display: inline-block;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 0.5rem;
    padding: 0.45rem 0.7rem;
    cursor: pointer;
    font-size: 0.85rem;
  }

  input[type='file'] {
    display: none;
  }

  .palette-list {
    margin-top: 0.8rem;
    display: grid;
    gap: 0.65rem;
  }

  h4 {
    margin: 0 0 0.35rem;
    font-size: 0.8rem;
    color: #334155;
  }

  .swatches {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
  }

  .swatches button {
    width: 28px;
    height: 28px;
    border: 1px solid #d1d5db;
    border-radius: 0.35rem;
    cursor: pointer;
  }
</style>
