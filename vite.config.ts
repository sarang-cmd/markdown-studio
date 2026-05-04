import { defineConfig } from 'vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'node:path';

export default defineConfig({
  plugins: [svelte({ preprocess: vitePreprocess() })],
  publicDir: 'static',
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, 'src/lib')
    }
  }
});
