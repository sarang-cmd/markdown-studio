<script lang="ts">
  import { documentStore } from '$lib/stores/document';
  import { get } from 'svelte/store';

  let content = '';
  const unsubscribe = documentStore.subscribe(doc => content = doc.content);

  function onInput(e: Event) {
    const v = (e.target as HTMLTextAreaElement).value;
    documentStore.updateContent(v);
  }

  // cleanup
  // onDestroy would be ideal, but keep this minimal for scaffold
</script>

<style>
  textarea { width: 100%; height: 100%; padding: 1rem; box-sizing: border-box; font-family: ui-monospace, monospace; font-size: 14px; }
</style>

<textarea on:input={onInput} bind:value={content} />
