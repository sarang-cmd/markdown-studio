# PRD: Markdown Studio - Advanced Editor with Live Preview

## 1. Product Overview

### Vision
Create a delightful, privacy-first markdown editor that runs entirely in the browser, offering real-time preview, built-in color palette tools for styling, and export to multiple formats. The experience should feel playful yet professional.

### Target Users
- Writers and bloggers
- Developers writing documentation
- Students creating formatted notes
- Content creators needing multi-format exports

### Core Value Proposition
- **100% client-side** - No data leaves your browser
- **Fast & Responsive** - WASM-powered rendering and export
- **Customizable & Fun** - Live themes, color palettes, and interactive styling
- **Universal Export** - One document → many formats

---

## 2. Features & Requirements

### 2.1 Core Editor Features

#### Markdown Editing
- **Split-pane interface** (editor | preview)
- Adjustable pane sizes (drag divider)
- **Syntax highlighting** in editor
- Line numbers (toggleable)
- Auto-save to browser localStorage
- Keyboard shortcuts (Ctrl+B for bold, etc.)
- Search & replace
- Word/character count display

#### Live Preview
- **Instant rendering** (<16ms latency)
- GitHub Flavored Markdown (GFM) support
- Tables, task lists, strikethrough
- Code syntax highlighting (multiple languages)
- Math equations (KaTeX/MathJax)
- Mermaid diagram support
- Auto-scroll sync between editor and preview

### 2.2 Color Palette Generator & Theming

#### Palette Generator
- **Generate palettes from**:
  - Uploaded images (extract dominant colors)
  - Color theory (complementary, triadic, analogous)
  - Random generation with lock/unlock individual colors
  - Manual color picker
  
- **Palette features**:
  - Save up to 10 custom palettes
  - Name your palettes
  - Export palette as JSON/CSS variables
  - Copy hex codes on click
  - Accessibility checker (contrast ratios)

#### Theme Customization
- **Pre-built themes**: Light, Dark, Solarized, Dracula, Nord, Monokai
- **Custom theme builder**:
  - Background color
  - Text color (primary, secondary, muted)
  - Heading colors (H1-H6 independent)
  - Link color (normal, hover)
  - Code block background/text
  - Blockquote styling
  - Accent color
  
- **Fun elements**:
  - Theme preview thumbnails
  - "Surprise me" random theme button
  - Smooth color transitions
  - Theme marketplace (community themes - future)

### 2.3 Export Capabilities

#### Supported Formats
1. **PDF** - High quality, preserves styling
2. **DOCX** - Microsoft Word compatible
3. **HTML** - Standalone with embedded CSS
4. **ODT** - OpenDocument Text
5. **EPUB** - eBook format
6. **LaTeX** - Academic papers
7. **Plain Text** - Strip all formatting
8. **Markdown** - Save source

#### Export Options
- **Page settings**: A4, Letter, Legal, Custom
- **Margins**: Presets or custom (cm/inches)
- **Headers/Footers**: Optional, customizable
- **Table of Contents**: Auto-generate option
- **Metadata**: Title, author, date
- **Style preservation**: Use current theme in export
- **Image handling**: Embed or link
- **Batch export**: Multiple formats at once

### 2.4 Fun & Delight Features

#### Interactive Elements
- **Typing effects**: 
  - Cursor animations
  - Subtle particle effects on headers (toggleable)
  - Smooth fade-in for preview updates

- **Easter eggs**:
  - Konami code activates rainbow mode
  - Type `/confetti` for celebration animation
  - Hidden themes unlockable

#### Productivity Boosters
- **Writing stats dashboard**:
  - Words per minute
  - Session writing streak
  - Time spent writing
  
- **Focus mode**: Dim everything except current paragraph
- **Pomodoro timer**: Built-in with notifications
- **Distraction-free mode**: Full-screen, minimal UI
- **Template library**: Blog post, README, Resume, etc.

### 2.5 File Management

- **Import from**:
  - Local files (.md, .txt)
  - Drag & drop support
  - Paste from clipboard
  
- **Document management**:
  - Multiple documents in tabs
  - Quick switcher (Ctrl+P)
  - Session restore (reopen last docs)
  - Cloud sync option (Google Drive, Dropbox - optional)

---

## 3. Technical Architecture

### 3.1 Technology Stack

**Frontend Framework**: React or Svelte (recommend Svelte for smaller bundle)

**WebAssembly Components**:
- **Markdown parsing**: Use `markdown-it` or compile `pulldown-cmark` (Rust) to WASM
- **PDF generation**: `jsPDF` or WASM-compiled library
- **DOCX generation**: `docx` npm package or WASM alternative
- **Image processing**: For color extraction - compile `image` crate (Rust) to WASM

**Key Libraries**:
- **Editor**: CodeMirror 6 or Monaco Editor
- **Syntax highlighting**: Prism.js or Shiki
- **Math rendering**: KaTeX
- **Diagrams**: Mermaid
- **Color manipulation**: `chroma.js` or `color` crate (Rust→WASM)
- **Storage**: IndexedDB (via `idb` wrapper)

### 3.2 Performance Targets

- **Initial load**: < 2 seconds
- **Markdown rendering**: < 16ms (60fps)
- **PDF export**: < 3 seconds for 10-page doc
- **Image color extraction**: < 500ms
- **Bundle size**: < 500KB (gzipped, excluding WASM)

### 3.3 Data Flow

```
User Input → CodeMirror → Debounced Update (100ms)
                              ↓
                     WASM Markdown Parser
                              ↓
                    HTML + Styling Applied
                              ↓
                      Preview Pane Render
                              ↓
                   LocalStorage Auto-save
```

---

## 4. User Interface Design

### 4.1 Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  [Logo] Markdown Studio    [Save] [Export ▾] [⚙️]   │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│   Editor     │        Live Preview                 │
│   Pane       │        Pane                         │
│              │                                      │
│  # Heading   │   ┌──────────────────┐              │
│  Content...  │   │ Heading          │              │
│              │   └──────────────────┘              │
│              │   Content...                        │
│              │                                      │
├──────────────┴──────────────────────────────────────┤
│  100 words | 500 chars | Auto-saved 2 min ago      │
└─────────────────────────────────────────────────────┘
```

### 4.2 Color Palette Panel

**Accessible via**: Button in toolbar or `Ctrl+K`

```
┌─────────────────────────────────────┐
│  Color Palette Generator      [×]   │
├─────────────────────────────────────┤
│                                     │
│  [Upload Image] [Generate] [Theory] │
│                                     │
│  Your Palettes:                     │
│  ┌─────────────────────────────┐   │
│  │ ███ ███ ███ ███ ███  Sunset│   │
│  │ ███ ███ ███ ███ ███  Ocean │   │
│  └─────────────────────────────┘   │
│                                     │
│  Current Theme Colors:              │
│  Background:  [#FFFFFF] 🔒          │
│  Text:        [#333333] 🔓          │
│  Headings:    [#1A1A1A] 🔓          │
│  Links:       [#0066CC] 🔓          │
│  Code:        [#F5F5F5] 🔓          │
│                                     │
│  [Apply to Document] [Save Theme]   │
└─────────────────────────────────────┘
```

### 4.3 Export Dialog

```
┌─────────────────────────────────────┐
│  Export Document              [×]   │
├─────────────────────────────────────┤
│  Select Formats:                    │
│  ☑ PDF    ☑ DOCX   ☐ HTML          │
│  ☐ ODT    ☐ EPUB   ☐ LaTeX         │
│                                     │
│  Options:                           │
│  Page Size: [A4 ▾]                  │
│  Margins: [Normal ▾]                │
│  ☑ Include Table of Contents        │
│  ☑ Preserve Current Theme           │
│                                     │
│  Metadata:                          │
│  Title: [My Document________]       │
│  Author: [________________]         │
│                                     │
│        [Cancel]  [Export All]       │
└─────────────────────────────────────┘
```

---

## 5. User Stories & Acceptance Criteria

### Story 1: Quick Start
**As a** new user  
**I want to** start writing immediately without configuration  
**So that** I can focus on content

**Acceptance Criteria**:
- App loads with sample markdown and preview visible
- No signup/login required
- Default theme is pleasant and readable
- Sample content demonstrates key features

### Story 2: Create Custom Theme
**As a** designer  
**I want to** create a custom color theme from my brand colors  
**So that** my documents match my brand

**Acceptance Criteria**:
- Can manually set each color component
- Preview updates in real-time
- Can save theme with custom name
- Can export theme as CSS variables

### Story 3: Extract Colors from Image
**As a** content creator  
**I want to** extract a color palette from a photo  
**So that** my document design complements my imagery

**Acceptance Criteria**:
- Can upload JPG/PNG images
- Extracts 5-8 dominant colors within 500ms
- Can lock individual colors and regenerate
- Shows color codes in hex/RGB

### Story 4: Export to Multiple Formats
**As a** writer  
**I want to** export my document to PDF and DOCX simultaneously  
**So that** I can share with different audiences

**Acceptance Criteria**:
- Can select multiple formats in one export
- All exports complete within 5 seconds
- Styling is preserved accurately
- Files download as ZIP if multiple formats

### Story 5: Focus Mode Writing
**As a** distracted writer  
**I want to** enable focus mode  
**So that** I can concentrate on current paragraph

**Acceptance Criteria**:
- Keyboard shortcut activates (F11 or Ctrl+Shift+F)
- Only current paragraph is fully visible
- Smooth transition effect
- Easy exit (Esc key)

---

## 6. MVP vs. Future Phases

### MVP (Phase 1) - 4-6 weeks
✅ Split-pane editor with live preview  
✅ Basic markdown rendering (GFM)  
✅ 3 export formats: PDF, HTML, Markdown  
✅ 5 pre-built themes  
✅ Basic color palette generator (manual picker)  
✅ LocalStorage auto-save  
✅ Syntax highlighting in code blocks  

### Phase 2 - Add Delight
✅ Color extraction from images  
✅ Custom theme builder  
✅ Advanced exports: DOCX, ODT, EPUB  
✅ Focus mode & writing stats  
✅ Diagram support (Mermaid)  
✅ Math equations  

### Phase 3 - Power Features
✅ Multi-document tabs  
✅ Template library  
✅ Cloud sync integration  
✅ Collaborative editing  
✅ Plugin system  
✅ Mobile responsive version  

---

## 7. Success Metrics

### Usage Metrics
- **Daily Active Users**: Target 1,000 in first 3 months
- **Session Duration**: Average > 10 minutes
- **Export Actions**: > 30% of sessions result in export
- **Theme Customization**: > 40% create custom theme

### Performance Metrics
- **Load Time**: < 2 seconds (90th percentile)
- **Render Latency**: < 16ms (95th percentile)
- **Export Success Rate**: > 99%

### Quality Metrics
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Accessibility**: WCAG 2.1 AA compliant
- **Bug Reports**: < 5 critical bugs per month post-launch

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| WASM bundle too large | High load times | Code splitting, lazy load export modules |
| Export quality issues | User dissatisfaction | Extensive testing suite, format-specific validators |
| Browser compatibility | Reduced audience | Polyfills, graceful degradation, clear browser requirements |
| Color extraction performance | Poor UX | Web Workers, show progress indicator, optimize algorithm |
| Complex state management | Bugs, maintenance | Use proven state library (Zustand/Redux), comprehensive tests |

---

# AI Development Prompt

Use this prompt to guide agentic AI in building the application:

---

## 🤖 COMPLETE AI DEVELOPMENT PROMPT

```markdown
# Project: Markdown Studio - Advanced Markdown Editor

## Objective
Build a complete, production-ready WebAssembly-powered markdown editor with live preview, 
color palette generation, and multi-format export capabilities. The application should be 
fun, performant, and run entirely in the browser.

## Technical Requirements

### Technology Stack
- **Framework**: Svelte + SvelteKit (for optimal bundle size and performance)
- **Editor**: CodeMirror 6 (modern, extensible)
- **Styling**: TailwindCSS + custom CSS variables for theming
- **State Management**: Svelte stores
- **Storage**: IndexedDB via `idb` library
- **Build Tool**: Vite with WASM plugin

### WebAssembly Components (Rust → WASM)

1. **Markdown Parser** (`markdown_parser/`)
   - Use `pulldown-cmark` crate
   - Compile to WASM with `wasm-bindgen`
   - Expose parse function: `parse_markdown(input: &str) -> String`
   - Support GFM extensions
   - Target: < 10ms parse time for 10KB document

2. **Color Extractor** (`color_extractor/`)
   - Use `image` and `palette_extract` crates
   - Function: `extract_palette(image_data: &[u8], count: usize) -> Vec<Color>`
   - Return RGB values
   - Target: < 500ms for 2MB image

3. **PDF Generator** (`pdf_generator/`)
   - Use `printpdf` or integrate with `jsPDF` via JS glue
   - Function: `generate_pdf(html: &str, options: PdfOptions) -> Vec<u8>`
   - Support custom page sizes, margins
   - Preserve CSS styling

### File Structure
```
markdown-studio/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Editor.svelte
│   │   │   ├── Preview.svelte
│   │   │   ├── ColorPalette.svelte
│   │   │   ├── ExportDialog.svelte
│   │   │   ├── ThemeBuilder.svelte
│   │   │   └── Toolbar.svelte
│   │   ├── stores/
│   │   │   ├── document.ts
│   │   │   ├── theme.ts
│   │   │   └── settings.ts
│   │   ├── utils/
│   │   │   ├── exporters/
│   │   │   │   ├── pdf.ts
│   │   │   │   ├── docx.ts
│   │   │   │   ├── html.ts
│   │   │   │   └── epub.ts
│   │   │   ├── colorUtils.ts
│   │   │   └── storage.ts
│   │   └── wasm/
│   │       ├── markdown_parser.js
│   │       ├── color_extractor.js
│   │       └── pdf_generator.js
│   ├── routes/
│   │   └── +page.svelte
│   └── app.html
├── wasm_modules/
│   ├── markdown_parser/
│   │   ├── Cargo.toml
│   │   └── src/lib.rs
│   ├── color_extractor/
│   │   ├── Cargo.toml
│   │   └── src/lib.rs
│   └── pdf_generator/
│       ├── Cargo.toml
│       └── src/lib.rs
├── static/
│   ├── themes/
│   └── templates/
└── package.json
```

## Implementation Steps

### Phase 1: Core Editor (Week 1-2)

#### Step 1.1: Project Setup
```bash
# Initialize project
npm create svelte@latest markdown-studio
cd markdown-studio
npm install

# Install dependencies
npm install -D tailwindcss postcss autoprefixer
npm install codemirror @codemirror/lang-markdown
npm install idb
npm install @tabler/icons-svelte

# WASM tooling
cargo install wasm-pack
```

#### Step 1.2: Markdown Parser WASM Module
Create `wasm_modules/markdown_parser/src/lib.rs`:

```rust
use wasm_bindgen::prelude::*;
use pulldown_cmark::{html, Options, Parser};

#[wasm_bindgen]
pub fn parse_markdown(input: &str) -> String {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_TABLES);
    options.insert(Options::ENABLE_STRIKETHROUGH);
    options.insert(Options::ENABLE_TASKLISTS);
    
    let parser = Parser::new_ext(input, options);
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);
    
    html_output
}

#[wasm_bindgen]
pub fn count_words(input: &str) -> usize {
    input.split_whitespace().count()
}
```

Build command: `wasm-pack build --target web`

#### Step 1.3: Editor Component
Create `src/lib/components/Editor.svelte`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { markdown } from '@codemirror/lang-markdown';
  import { documentStore } from '$lib/stores/document';
  import { debounce } from '$lib/utils/helpers';

  let editorContainer: HTMLDivElement;
  let editorView: EditorView;

  const updatePreview = debounce((content: string) => {
    documentStore.updateContent(content);
  }, 100);

  onMount(async () => {
    // Initialize CodeMirror
    editorView = new EditorView({
      doc: $documentStore.content,
      extensions: [
        basicSetup,
        markdown(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            updatePreview(update.state.doc.toString());
          }
        })
      ],
      parent: editorContainer
    });

    return () => editorView.destroy();
  });
</script>

<div class="editor-wrapper h-full">
  <div bind:this={editorContainer} class="h-full" />
</div>

<style>
  .editor-wrapper {
    font-family: 'JetBrains Mono', monospace;
  }
</style>
```

#### Step 1.4: Preview Component
Create `src/lib/components/Preview.svelte`:

```svelte
<script lang="ts">
  import { documentStore } from '$lib/stores/document';
  import { themeStore } from '$lib/stores/theme';
  import { onMount } from 'svelte';
  
  let previewHTML = '';
  let wasmParser: any;

  onMount(async () => {
    // Load WASM module
    const module = await import('$lib/wasm/markdown_parser.js');
    await module.default();
    wasmParser = module;
    
    // Subscribe to document changes
    documentStore.subscribe(async (doc) => {
      if (wasmParser && doc.content) {
        previewHTML = wasmParser.parse_markdown(doc.content);
      }
    });
  });
</script>

<div 
  class="preview-pane prose prose-lg max-w-none p-8"
  style="
    --bg-color: {$themeStore.backgroundColor};
    --text-color: {$themeStore.textColor};
    --heading-color: {$themeStore.headingColor};
  "
>
  {@html previewHTML}
</div>

<style>
  .preview-pane {
    background-color: var(--bg-color);
    color: var(--text-color);
  }
  
  .preview-pane :global(h1, h2, h3, h4, h5, h6) {
    color: var(--heading-color);
  }
</style>
```

### Phase 2: Color Palette Generator (Week 3)

#### Step 2.1: Color Extractor WASM
Create `wasm_modules/color_extractor/src/lib.rs`:

```rust
use wasm_bindgen::prelude::*;
use image::{DynamicImage, GenericImageView};
use palette_extract::{get_palette_rgb, Quality};

#[wasm_bindgen]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

#[wasm_bindgen]
pub fn extract_colors(image_data: &[u8], count: usize) -> Vec<JsValue> {
    let img = image::load_from_memory(image_data).unwrap();
    let pixels: Vec<_> = img.pixels()
        .map(|(_, _, rgba)| (rgba[0], rgba[1], rgba[2]))
        .collect();
    
    let palette = get_palette_rgb(&pixels);
    
    palette.iter()
        .take(count)
        .map(|c| {
            let color = Color {
                r: c.r,
                g: c.g,
                b: c.b,
            };
            JsValue::from(color)
        })
        .collect()
}

#[wasm_bindgen]
pub fn hex_to_rgb(hex: &str) -> Color {
    let hex = hex.trim_start_matches('#');
    let r = u8::from_str_radix(&hex[0..2], 16).unwrap_or(0);
    let g = u8::from_str_radix(&hex[2..4], 16).unwrap_or(0);
    let b = u8::from_str_radix(&hex[4..6], 16).unwrap_or(0);
    
    Color { r, g, b }
}
```

#### Step 2.2: Color Palette Component
Create `src/lib/components/ColorPalette.svelte`:

```svelte
<script lang="ts">
  import { paletteStore } from '$lib/stores/palette';
  import { themeStore } from '$lib/stores/theme';
  
  let imageInput: HTMLInputElement;
  let extracting = false;

  async function handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    extracting = true;
    
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const { extract_colors } = await import('$lib/wasm/color_extractor.js');
    const colors = extract_colors(uint8Array, 6);
    
    paletteStore.addPalette({
      name: 'From ' + file.name,
      colors: colors.map(c => `#${rgbToHex(c.r, c.g, c.b)}`)
    });
    
    extracting = false;
  }

  function rgbToHex(r: number, g: number, b: number): string {
    return [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  }

  function applyColorToTheme(color: string, property: string) {
    themeStore.updateColor(property, color);
  }
</script>

<div class="palette-panel p-4">
  <h3 class="text-lg font-bold mb-4">Color Palette Generator</h3>
  
  <div class="mb-4">
    <button 
      on:click={() => imageInput.click()}
      class="btn btn-primary"
      disabled={extracting}
    >
      {extracting ? 'Extracting...' : 'Upload Image'}
    </button>
    <input 
      bind:this={imageInput}
      type="file" 
      accept="image/*"
      on:change={handleImageUpload}
      class="hidden"
    />
  </div>

  <div class="palettes">
    {#each $paletteStore.palettes as palette}
      <div class="palette-item mb-3">
        <div class="font-medium mb-1">{palette.name}</div>
        <div class="flex gap-2">
          {#each palette.colors as color}
            <button
              class="color-swatch w-10 h-10 rounded border-2"
              style="background-color: {color}"
              on:click={() => navigator.clipboard.writeText(color)}
              title="Click to copy {color}"
            />
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <div class="theme-colors mt-6">
    <h4 class="font-medium mb-2">Current Theme</h4>
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <label>Background:</label>
        <input 
          type="color" 
          value={$themeStore.backgroundColor}
          on:change={(e) => themeStore.updateColor('backgroundColor', e.currentTarget.value)}
        />
        <span class="text-sm">{$themeStore.backgroundColor}</span>
      </div>
      <!-- Repeat for other theme colors -->
    </div>
  </div>
</div>
```

### Phase 3: Export System (Week 4)

#### Step 3.1: PDF Export
Create `src/lib/utils/exporters/pdf.ts`:

```typescript
import { jsPDF } from 'jspdf';
import type { Theme } from '$lib/stores/theme';

export async function exportToPDF(
  html: string,
  theme: Theme,
  options: {
    title?: string;
    author?: string;
    pageSize?: 'a4' | 'letter';
  }
): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: options.pageSize || 'a4'
  });

  // Set document properties
  if (options.title) doc.setProperties({ title: options.title });
  if (options.author) doc.setProperties({ author: options.author });

  // Create temporary div for HTML rendering
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  tempDiv.style.cssText = `
    font-family: ${theme.fontFamily};
    color: ${theme.textColor};
    background: ${theme.backgroundColor};
    padding: 20px;
  `;
  
  document.body.appendChild(tempDiv);
  
  // Use html2canvas or similar to render
  await doc.html(tempDiv, {
    callback: () => {
      document.body.removeChild(tempDiv);
    },
    x: 10,
    y: 10,
    width: 190,
    windowWidth: 800
  });

  return doc.output('blob');
}
```

#### Step 3.2: DOCX Export
Create `src/lib/utils/exporters/docx.ts`:

```typescript
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export async function exportToDOCX(
  markdown: string,
  options: {
    title?: string;
    author?: string;
  }
): Promise<Blob> {
  // Parse markdown to structured data
  const sections = parseMarkdownToSections(markdown);
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: sections.map(section => {
        if (section.type === 'heading') {
          return new Paragraph({
            text: section.content,
            heading: HeadingLevel[`HEADING_${section.level}`]
          });
        } else {
          return new Paragraph({
            children: [new TextRun(section.content)]
          });
        }
      })
    }]
  });

  return await Packer.toBlob(doc);
}

function parseMarkdownToSections(markdown: string) {
  // Simple parser - enhance as needed
  const lines = markdown.split('\n');
  const sections = [];
  
  for (const line of lines) {
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 1;
      sections.push({
        type: 'heading',
        level,
        content: line.replace(/^#+\s*/, '')
      });
    } else if (line.trim()) {
      sections.push({
        type: 'paragraph',
        content: line
      });
    }
  }
  
  return sections;
}
```

#### Step 3.3: Export Dialog Component
Create `src/lib/components/ExportDialog.svelte`:

```svelte
<script lang="ts">
  import { documentStore } from '$lib/stores/document';
  import { themeStore } from '$lib/stores/theme';
  import { exportToPDF } from '$lib/utils/exporters/pdf';
  import { exportToDOCX } from '$lib/utils/exporters/docx';
  import { exportToHTML } from '$lib/utils/exporters/html';

  let selectedFormats = {
    pdf: true,
    docx: false,
    html: false,
    markdown: false
  };

  let exporting = false;
  let metadata = {
    title: '',
    author: '',
    pageSize: 'a4' as const
  };

  async function handleExport() {
    exporting = true;
    const exports = [];

    try {
      if (selectedFormats.pdf) {
        const blob = await exportToPDF(
          $documentStore.renderedHTML,
          $themeStore,
          metadata
        );
        exports.push({ blob, filename: 'document.pdf' });
      }

      if (selectedFormats.docx) {
        const blob = await exportToDOCX($documentStore.content, metadata);
        exports.push({ blob, filename: 'document.docx' });
      }

      if (selectedFormats.html) {
        const blob = await exportToHTML(
          $documentStore.renderedHTML,
          $themeStore
        );
        exports.push({ blob, filename: 'document.html' });
      }

      if (selectedFormats.markdown) {
        const blob = new Blob([$documentStore.content], { type: 'text/markdown' });
        exports.push({ blob, filename: 'document.md' });
      }

      // Download all files
      for (const { blob, filename } of exports) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      exporting = false;
    }
  }
</script>

<dialog class="export-dialog" open>
  <div class="dialog-content">
    <h2>Export Document</h2>
    
    <div class="format-selection">
      <label>
        <input type="checkbox" bind:checked={selectedFormats.pdf} />
        PDF
      </label>
      <label>
        <input type="checkbox" bind:checked={selectedFormats.docx} />
        DOCX
      </label>
      <label>
        <input type="checkbox" bind:checked={selectedFormats.html} />
        HTML
      </label>
      <label>
        <input type="checkbox" bind:checked={selectedFormats.markdown} />
        Markdown
      </label>
    </div>

    <div class="metadata">
      <input 
        type="text" 
        placeholder="Document Title"
        bind:value={metadata.title}
      />
      <input 
        type="text" 
        placeholder="Author"
        bind:value={metadata.author}
      />
      <select bind:value={metadata.pageSize}>
        <option value="a4">A4</option>
        <option value="letter">Letter</option>
      </select>
    </div>

    <div class="actions">
      <button on:click={() => close()}>Cancel</button>
      <button 
        on:click={handleExport}
        disabled={exporting}
        class="btn-primary"
      >
        {exporting ? 'Exporting...' : 'Export'}
      </button>
    </div>
  </div>
</dialog>
```

### Phase 4: Stores & State Management

#### Document Store
Create `src/lib/stores/document.ts`:

```typescript
import { writable, derived } from 'svelte/store';
import { saveToIndexedDB, loadFromIndexedDB } from '$lib/utils/storage';

interface Document {
  id: string;
  content: string;
  renderedHTML: string;
  wordCount: number;
  lastModified: Date;
}

function createDocumentStore() {
  const { subscribe, set, update } = writable<Document>({
    id: crypto.randomUUID(),
    content: '# Welcome to Markdown Studio\n\nStart writing...',
    renderedHTML: '',
    wordCount: 0,
    lastModified: new Date()
  });

  return {
    subscribe,
    updateContent: (content: string) => {
      update(doc => {
        const updated = {
          ...doc,
          content,
          wordCount: content.split(/\s+/).length,
          lastModified: new Date()
        };
        
        // Auto-save to IndexedDB
        saveToIndexedDB(updated);
        
        return updated;
      });
    },
    updateRenderedHTML: (html: string) => {
      update(doc => ({ ...doc, renderedHTML: html }));
    },
    load: async (id: string) => {
      const doc = await loadFromIndexedDB(id);
      if (doc) set(doc);
    }
  };
}

export const documentStore = createDocumentStore();
```

#### Theme Store
Create `src/lib/stores/theme.ts`:

```typescript
import { writable } from 'svelte/store';

export interface Theme {
  name: string;
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  linkColor: string;
  codeBackground: string;
  codeText: string;
  fontFamily: string;
}

const defaultTheme: Theme = {
  name: 'Light',
  backgroundColor: '#ffffff',
  textColor: '#333333',
  headingColor: '#1a1a1a',
  linkColor: '#0066cc',
  codeBackground: '#f5f5f5',
  codeText: '#c7254e',
  fontFamily: 'Inter, system-ui, sans-serif'
};

const presetThemes: Theme[] = [
  defaultTheme,
  {
    name: 'Dark',
    backgroundColor: '#1a1a1a',
    textColor: '#e0e0e0',
    headingColor: '#ffffff',
    linkColor: '#4a9eff',
    codeBackground: '#2d2d2d',
    codeText: '#ff79c6',
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  {
    name: 'Solarized',
    backgroundColor: '#fdf6e3',
    textColor: '#657b83',
    headingColor: '#073642',
    linkColor: '#268bd2',
    codeBackground: '#eee8d5',
    codeText: '#cb4b16',
    fontFamily: 'Inter, system-ui, sans-serif'
  }
];

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>(defaultTheme);

  return {
    subscribe,
    setTheme: (theme: Theme) => set(theme),
    updateColor: (property: keyof Theme, color: string) => {
      update(theme => ({ ...theme, [property]: color }));
    },
    presets: presetThemes
  };
}

export const themeStore = createThemeStore();
```

### Phase 5: Polish & Fun Features

#### Typing Effects
Add to Preview component:

```svelte
<script>
  import { fade, fly } from 'svelte/transition';
  
  let showConfetti = false;
  
  function checkForEasterEggs(content: string) {
    if (content.includes('/confetti')) {
      triggerConfetti();
    }
  }
  
  function triggerConfetti() {
    showConfetti = true;
    setTimeout(() => showConfetti = false, 3000);
  }
</script>

{#if showConfetti}
  <div class="confetti-container" transition:fade>
    <!-- Canvas-based confetti animation -->
  </div>
{/if}
```

#### Writing Stats Dashboard
Create `src/lib/components/WritingStats.svelte`:

```svelte
<script lang="ts">
  import { documentStore } from '$lib/stores/document';
  import { onMount, onDestroy } from 'svelte';
  
  let sessionStartTime = Date.now();
  let wordsWritten = 0;
  let timeElapsed = 0;
  let interval: number;

  onMount(() => {
    interval = setInterval(() => {
      timeElapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    }, 1000);
  });

  onDestroy(() => clearInterval(interval));

  $: wpm = timeElapsed > 0 ? (wordsWritten / (timeElapsed / 60)).toFixed(1) : '0';
</script>

<div class="stats-bar flex gap-4 text-sm text-gray-600">
  <span>{$documentStore.wordCount} words</span>
  <span>{$documentStore.content.length} characters</span>
  <span>{wpm} WPM</span>
  <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
</div>
```

## Testing Requirements

### Unit Tests
```typescript
// Test markdown parsing
describe('Markdown Parser', () => {
  it('should parse basic markdown', async () => {
    const result = await parseMarkdown('# Hello\n\nWorld');
    expect(result).toContain('<h1>Hello</h1>');
    expect(result).toContain('<p>World</p>');
  });
});

// Test color extraction
describe('Color Extractor', () => {
  it('should extract colors from image', async () => {
    const colors = await extractColors(mockImageData, 5);
    expect(colors).toHaveLength(5);
    expect(colors[0]).toHaveProperty('r');
  });
});

// Test exports
describe('PDF Export', () => {
  it('should generate valid PDF', async () => {
    const blob = await exportToPDF(mockHTML, mockTheme, {});
    expect(blob.type).toBe('application/pdf');
    expect(blob.size).toBeGreaterThan(0);
  });
});
```

### E2E Tests (Playwright)
```typescript
test('complete editing workflow', async ({ page }) => {
  await page.goto('/');
  
  // Type in editor
  await page.locator('.cm-content').fill('# Test Document\n\nContent here');
  
  // Verify preview updates
  await expect(page.locator('.preview-pane h1')).toHaveText('Test Document');
  
  // Open export dialog
  await page.click('button:has-text("Export")');
  
  // Select PDF
  await page.check('input[type="checkbox"]:has-text("PDF")');
  
  // Download
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("Export All")');
  const download = await downloadPromise;
  
  expect(download.suggestedFilename()).toBe('document.pdf');
});
```

## Performance Optimization Checklist

- [ ] Lazy load WASM modules
- [ ] Code split export functions
- [ ] Debounce editor updates (100ms)
- [ ] Use Web Workers for heavy processing
- [ ] Implement virtual scrolling for long documents
- [ ] Cache parsed markdown (LRU cache)
- [ ] Optimize theme switching (CSS variables)
- [ ] Compress WASM binaries with Brotli
- [ ] Preload critical resources
- [ ] Use requestIdleCallback for auto-save

## Accessibility Requirements

- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation for all features (document shortcuts)
- [ ] Screen reader support (ARIA labels)
- [ ] High contrast mode
- [ ] Focus indicators
- [ ] Color contrast checker in palette generator
- [ ] Resizable panels (drag or keyboard)
- [ ] Skip links
- [ ] Semantic HTML

## Deployment

```bash
# Build for production
npm run build

# Preview
npm run preview

# Deploy to Vercel/Netlify
# Ensure WASM files are served with correct MIME type
# Add to vercel.json or netlify.toml:
{
  "headers": [
    {
      "source": "/(.*)\\.wasm",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/wasm"
        }
      ]
    }
  ]
}
```

## Success Criteria

✅ App loads in < 2 seconds on 3G  
✅ Markdown renders in < 16ms  
✅ All export formats work correctly  
✅ Color extraction completes in < 500ms  
✅ No accessibility violations  
✅ Works in Chrome, Firefox, Safari, Edge (latest 2 versions)  
✅ Lighthouse score > 90 (Performance, Accessibility, Best Practices)  
✅ Bundle size < 500KB gzipped  

## Additional Features to Consider

1. **Template System**: Pre-built templates for blog posts, resumes, READMEs
2. **Markdown Snippets**: Quick insert for tables, code blocks, etc.
3. **Image Upload & Optimization**: Drag-drop images, auto-compress
4. **Version History**: Track document changes over time
5. **Collaboration**: Real-time co-editing (WebRTC or WebSocket)
6. **Plugin System**: Allow community extensions
7. **Mobile App**: Capacitor/Tauri wrapper for mobile
8. **Cloud Sync**: Optional sync to Google Drive/Dropbox
9. **AI Writing Assistant**: Suggest completions, grammar check
10. **Print Styles**: Optimized CSS for direct printing

## Resources & References

- CodeMirror 6 Docs: https://codemirror.net/6/
- pulldown-cmark: https://docs.rs/pulldown-cmark/
- wasm-bindgen: https://rustwasm.github.io/wasm-bindgen/
- jsPDF: https://github.com/parallax/jsPDF
- Docx library: https://docx.js.org/
- Svelte: https://svelte.dev/
- TailwindCSS: https://tailwindcss.com/

---

## Final Notes for AI Agent

- Prioritize code quality and readability
- Add comprehensive error handling
- Include helpful comments
- Follow TypeScript best practices
- Ensure responsive design (mobile-first)
- Write tests as you go
- Profile performance regularly
- Keep bundle size minimal
- Document all public APIs
- Create user-friendly error messages

Build this incrementally, testing each phase before moving to the next.
Focus on making the core experience delightful before adding advanced features.

Good luck! 🚀
```

---

This PRD and prompt should give you (or an AI agent) everything needed to build a production-ready markdown editor. The scope is ambitious but achievable in 4-6 weeks with focused development.

Key highlights:
- **Clear technical architecture** with Rust WASM modules
- **Step-by-step implementation** guide
- **Complete code examples** for core components
- **Testing strategy** included
- **Performance targets** defined
- **Accessibility built-in** from the start

Would you like me to elaborate on any specific section or provide additional code examples?