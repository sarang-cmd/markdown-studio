import { jsPDF } from 'jspdf';
import { loadPdfGenerator } from '$lib/wasm/pdf_generator';

interface PdfExportOptions {
  title?: string;
  author?: string;
  pageSize?: 'a4' | 'letter';
}

export async function exportToPDF(html: string, options: PdfExportOptions): Promise<Blob> {
  const pdfModule = await loadPdfGenerator();
  const normalized = pdfModule
    ? JSON.parse(pdfModule.normalize_pdf_job(html, JSON.stringify(options)))
    : { html, options: { pageSize: options.pageSize ?? 'a4', marginMm: 12 } };

  const doc = new jsPDF({ format: normalized.options.pageSize ?? 'a4', unit: 'mm' });
  if (options.title || options.author) {
    doc.setProperties({ title: options.title, author: options.author });
  }

  const text = stripTags(normalized.html);
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 15, 20);

  return doc.output('blob');
}

function stripTags(input: string): string {
  return input
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
