<script lang="ts">
  import Editor from '$lib/components/Editor.svelte';
  import Preview from '$lib/components/Preview.svelte';
</script>

<style>
  .container { display: flex; height: 100vh; }
  .pane { flex: 1; overflow: auto; }
  .divider { width: 1px; background: #e5e7eb; }
</style>

<div class="container">
  <div class="pane"><Editor /></div>
  <div class="divider"></div>
  <div class="pane"><Preview /></div>
</div>
