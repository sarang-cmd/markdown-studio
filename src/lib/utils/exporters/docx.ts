import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function exportToDOCX(markdown: string): Promise<Blob> {
  const lines = markdown.split('\n').filter((line) => line.trim().length > 0);
  const children = lines.map((line) => new Paragraph({ children: [new TextRun(line.replace(/^#+\s*/, ''))] }));

  const doc = new Document({
    sections: [{
      children
    }]
  });

  return Packer.toBlob(doc);
}
