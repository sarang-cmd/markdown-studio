<script lang="ts">
  import { basicSetup } from 'codemirror';
  import { markdown } from '@codemirror/lang-markdown';
  import { EditorView } from '@codemirror/view';
  import { onDestroy, onMount } from 'svelte';
  import { documentStore } from '$lib/stores/document';
  import { debounce } from '$lib/utils/helpers';

  let editorHost: HTMLDivElement;
  let editorView: EditorView | undefined;
  let initialContent = '';
  const unsubscribe = documentStore.subscribe((doc) => {
    initialContent = doc.content;
  });

  const pushChange = debounce((value: string) => {
    documentStore.updateContent(value);
  }, 100);

  onMount(() => {
    editorView = new EditorView({
      parent: editorHost,
      doc: initialContent,
      extensions: [
        basicSetup,
        markdown(),
        EditorView.lineWrapping,
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
    editorView?.destroy();
  });
</script>

<style>
  .editor {
    height: 100%;
  }

  .editor :global(.cm-editor) {
    height: 100%;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 14px;
  }
</style>

<div class="editor" bind:this={editorHost}></div>
