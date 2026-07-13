import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bytefuture.ai',
  output: 'static',
  build: {
    // Emit /blog/<slug>.html as actual files, not /blog/<slug>.html/index.html.
    // This preserves every already-published ByteFuture Writings URL.
    format: 'file',
  },
});
