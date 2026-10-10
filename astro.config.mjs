import { defineConfig } from 'astro/config';

const legacyDirectoryIndexes = {
  name: 'legacy-directory-indexes',
  hooks: {
    'astro:server:setup': ({ server }) => {
      server.middlewares.use((req, _res, next) => {
        const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
        if (pathname === '/') req.url = `/index.html${(req.url ?? '').slice(pathname.length)}`;
        if (pathname === '/blog/') req.url = `/blog/index.html${(req.url ?? '').slice(pathname.length)}`;
        next();
      });
    },
  },
};

export default defineConfig({
  site: 'https://bytefuture.ai',
  output: 'static',
  integrations: [legacyDirectoryIndexes],
  build: {
    // Emit /blog/<slug>.html as actual files, not /blog/<slug>.html/index.html.
    // This preserves every already-published ByteFuture Writings URL.
    format: 'file',
  },
});
