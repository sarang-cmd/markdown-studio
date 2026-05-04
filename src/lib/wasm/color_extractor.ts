type WasmColor = {
  r: number;
  g: number;
  b: number;
  hex: () => string;
};

type ColorExtractorModule = {
  extract_palette: (imageData: Uint8Array, count: number) => WasmColor[];
  default?: (input?: unknown) => Promise<void>;
};

let extractorModule: ColorExtractorModule | null = null;

export async function loadColorExtractor(): Promise<ColorExtractorModule | null> {
  if (extractorModule) {
    return extractorModule;
  }

  try {
    const modulePath = './pkg/color_extractor/color_extractor.js';
    const mod = (await import(/* @vite-ignore */ modulePath)) as ColorExtractorModule;
    if (typeof mod.default === 'function') {
      await mod.default();
    }
    extractorModule = mod;
    return extractorModule;
  } catch {
    return null;
  }
}
