<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { documentStore } from '$lib/stores/document';

  let elapsedSeconds = 0;
  let intervalId: ReturnType<typeof setInterval> | undefined;
  let startWordCount = 0;
  let initialized = false;

  const unsubscribe = documentStore.subscribe((doc) => {
    if (!initialized) {
      startWordCount = doc.wordCount;
      initialized = true;
    }
  });

  onMount(() => {
    intervalId = setInterval(() => {
      elapsedSeconds += 1;
    }, 1000);
  });

  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    unsubscribe();
  });

  $: wordsWritten = Math.max(0, $documentStore.wordCount - startWordCount);
  $: minutes = elapsedSeconds / 60;
  $: wpm = minutes > 0 ? (wordsWritten / minutes).toFixed(1) : '0.0';
  $: elapsedLabel = `${Math.floor(elapsedSeconds / 60)}:${(elapsedSeconds % 60)
    .toString()
    .padStart(2, '0')}`;
</script>

<div class="stats">
  <span>{$documentStore.wordCount} words</span>
  <span>{$documentStore.charCount} chars</span>
  <span>{wpm} WPM</span>
  <span>Session {elapsedLabel}</span>
  <span>Updated {new Date($documentStore.lastModified).toLocaleTimeString()}</span>
</div>

<style>
  .stats {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }
</style>
