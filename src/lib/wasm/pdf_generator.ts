type PdfGeneratorModule = {
  normalize_pdf_job: (html: string, optionsJson: string) => string;
  default?: (input?: unknown) => Promise<void>;
};

let pdfModule: PdfGeneratorModule | null = null;

export async function loadPdfGenerator(): Promise<PdfGeneratorModule | null> {
  if (pdfModule) {
    return pdfModule;
  }

  try {
    const modulePath = './pkg/pdf_generator/pdf_generator.js';
    const mod = (await import(/* @vite-ignore */ modulePath)) as PdfGeneratorModule;
    if (typeof mod.default === 'function') {
      await mod.default();
    }
    pdfModule = mod;
    return pdfModule;
  } catch {
    return null;
  }
}
