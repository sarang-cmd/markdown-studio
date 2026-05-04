import { writable } from 'svelte/store';

export interface Palette {
  id: string;
  name: string;
  colors: string[];
}

interface PaletteState {
  palettes: Palette[];
}

const defaultPalette: Palette = {
  id: crypto.randomUUID(),
  name: 'Starter',
  colors: ['#165DFF', '#14B8A6', '#FF6B00', '#FACC15', '#111827']
};

function createPaletteStore() {
  const { subscribe, update } = writable<PaletteState>({
    palettes: [defaultPalette]
  });

  return {
    subscribe,
    addPalette(name: string, colors: string[]) {
      update((state) => {
        const next = [{ id: crypto.randomUUID(), name, colors }, ...state.palettes].slice(0, 10);
        return { palettes: next };
      });
    }
  };
}

export const paletteStore = createPaletteStore();
