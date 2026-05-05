<script lang="ts">
  import { Compartment } from '@codemirror/state';
  import { basicSetup } from 'codemirror';
  import { markdown } from '@codemirror/lang-markdown';
  import { EditorView, keymap, lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
  import { onDestroy, onMount } from 'svelte';
  import { documentStore } from '$lib/stores/document';
  import { settingsStore } from '$lib/stores/settings';
  import { debounce } from '$lib/utils/helpers';

  let editorHost: HTMLDivElement;
  let editorView: EditorView | undefined;
  let initialContent = '';
  let showSearch = false;
  let findText = '';
  let replaceText = '';

  const lineNumberCompartment = new Compartment();

  const unsubscribe = documentStore.subscribe((doc) => {
    initialContent = doc.content;
  });

  const unsubscribeSettings = settingsStore.subscribe((settings) => {
    if (!editorView) {
      return;
    }

    const lineNumberExtensions = settings.lineNumbers
      ? [lineNumbers(), highlightActiveLineGutter()]
      : [];

    editorView.dispatch({
      effects: lineNumberCompartment.reconfigure(lineNumberExtensions)
    });
  });

  const pushChange = debounce((value: string) => {
    documentStore.updateContent(value);
  }, 100);

  function toggleBold(): boolean {
    if (!editorView) {
      return false;
    }

    const selection = editorView.state.selection.main;
    if (selection.empty) {
      editorView.dispatch({
        changes: { from: selection.from, to: selection.to, insert: '****' },
        selection: { anchor: selection.from + 2 }
      });
      editorView.focus();
      return true;
    }

    const selected = editorView.state.doc.sliceString(selection.from, selection.to);
    editorView.dispatch({
      changes: { from: selection.from, to: selection.to, insert: `**${selected}**` },
      selection: {
        anchor: selection.from + 2,
        head: selection.to + 2
      }
    });
    editorView.focus();
    return true;
  }

  function openSearch(): boolean {
    showSearch = true;
    return true;
  }

  function findNext() {
    if (!editorView || !findText.trim()) {
      return;
    }

    const doc = editorView.state.doc.toString();
    const cursor = editorView.state.selection.main.to;
    let index = doc.indexOf(findText, cursor + 1);
    if (index < 0) {
      index = doc.indexOf(findText, 0);
    }
    if (index < 0) {
      return;
    }

    editorView.dispatch({
      selection: { anchor: index, head: index + findText.length },
      scrollIntoView: true
    });
    editorView.focus();
  }

  function replaceCurrent() {
    if (!editorView || !findText.trim()) {
      return;
    }

    const selection = editorView.state.selection.main;
    const selected = editorView.state.doc.sliceString(selection.from, selection.to);

    if (selected !== findText) {
      findNext();
      return;
    }

    editorView.dispatch({
      changes: { from: selection.from, to: selection.to, insert: replaceText },
      selection: { anchor: selection.from, head: selection.from + replaceText.length }
    });
    editorView.focus();
  }

  function replaceAll() {
    if (!editorView || !findText.trim()) {
      return;
    }

    const source = editorView.state.doc.toString();
    const next = source.split(findText).join(replaceText);
    if (next === source) {
      return;
    }

    editorView.dispatch({
      changes: { from: 0, to: source.length, insert: next }
    });
    editorView.focus();
  }

  onMount(() => {
    const lineNumberExtensions = [lineNumbers(), highlightActiveLineGutter()];

    editorView = new EditorView({
      parent: editorHost,
      doc: initialContent,
      extensions: [
        basicSetup,
        markdown(),
        lineNumberCompartment.of(lineNumberExtensions),
        EditorView.lineWrapping,
        keymap.of([
          { key: 'Mod-b', run: toggleBold },
          { key: 'Mod-f', run: openSearch }
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            pushChange(update.state.doc.toString());
          }
        })
      ]
    });
  });

  onDestroy(() => {
    unsubscribe();
    unsubscribeSettings();
    editorView?.destroy();
  });
</script>

<style>
  .editor {
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
  }

  .search-bar {
    display: flex;
    gap: 0.35rem;
    align-items: center;
    padding: 0.35rem;
    border-bottom: 1px solid #cbd5e1;
    background: #f8fafc;
  }

  .search-bar input {
    border: 1px solid #cbd5e1;
    border-radius: 0.35rem;
    padding: 0.3rem 0.45rem;
    font-size: 0.8rem;
  }

  .search-bar button {
    border: 1px solid #cbd5e1;
    border-radius: 0.35rem;
    background: white;
    font-size: 0.78rem;
    padding: 0.28rem 0.45rem;
    cursor: pointer;
  }

  .editor-body :global(.cm-editor) {
    height: 100%;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 14px;
  }
</style>

<div class="editor">
  {#if showSearch}
    <div class="search-bar">
      <input placeholder="Find" bind:value={findText} />
      <input placeholder="Replace" bind:value={replaceText} />
      <button on:click={findNext}>Next</button>
      <button on:click={replaceCurrent}>Replace</button>
      <button on:click={replaceAll}>All</button>
      <button on:click={() => (showSearch = false)}>Close</button>
    </div>
  {/if}

  <div class="editor-body" bind:this={editorHost}></div>
</div>
