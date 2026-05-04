import type { Theme } from '$lib/stores/theme';

export function exportToHTML(renderedHTML: string, theme: Theme): Blob {
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Markdown Studio Export</title>
    <style>
      body {
        margin: 0;
        font-family: "Atkinson Hyperlegible", "Segoe UI", sans-serif;
        background: ${theme.backgroundColor};
        color: ${theme.textColor};
      }
      main {
        max-width: 960px;
        margin: 0 auto;
        padding: 2rem;
      }
      h1, h2, h3, h4, h5, h6 { color: ${theme.headingColor}; }
      a { color: ${theme.linkColor}; }
      pre {
        background: ${theme.codeBackground};
        color: ${theme.codeText};
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
      }
      code {
        background: ${theme.codeBackground};
        color: ${theme.codeText};
      }
    </style>
  </head>
  <body>
    <main>${renderedHTML}</main>
  </body>
</html>`;

  return new Blob([html], { type: 'text/html;charset=utf-8' });
}
