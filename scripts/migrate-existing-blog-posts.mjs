import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const blogDir = path.join(root, 'blog');
const outRoot = path.join(root, 'src/content/writings');

const langSuffix = /-(zh|ja|ko)$/;
const manifestByLang = new Map();
for (const [lang, file] of Object.entries({ en: 'posts.json', zh: 'posts-zh.json', ja: 'posts-ja.json', ko: 'posts-ko.json' })) {
  const full = path.join(root, file);
  const bySlug = new Map();
  if (fs.existsSync(full)) {
    for (const post of JSON.parse(fs.readFileSync(full, 'utf8'))) {
      bySlug.set(post.slug, post);
    }
  }
  manifestByLang.set(lang, bySlug);
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function yamlQuote(value) {
  return JSON.stringify(value || '');
}

function extract(pattern, html, fallback = '') {
  const match = html.match(pattern);
  if (!match) return fallback;
  const value = match.slice(1).find((group) => group !== undefined);
  return decodeEntities((value || '').trim());
}

function stripTags(value) {
  return decodeEntities(value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

function extractArticle(html) {
  const startMatch = html.match(/<article\b[^>]*class="[^"]*prose[^"]*"[^>]*>/i);
  if (!startMatch) return '';
  const start = startMatch.index + startMatch[0].length;
  const end = html.indexOf('</article>', start);
  if (end === -1) return '';
  return html.slice(start, end).trim();
}

function extractHeader(html) {
  const h1 = stripTags(extract(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html));
  const category = stripTags(extract(/<span[^>]*class="[^"]*category[^"]*"[^>]*>([\s\S]*?)<\/span>/i, html, 'tutorial')).toLowerCase();
  const datetime = extract(/<time[^>]*datetime="([^"]+)"[^>]*>/i, html, '');
  return { h1, category, date: datetime || '2026-01-01' };
}

function canonicalSlug(file) {
  const base = path.basename(file, '.html');
  const match = base.match(langSuffix);
  return { slug: match ? base.slice(0, -match[0].length) : base, lang: match ? match[1] : 'en' };
}

const files = fs.readdirSync(blogDir)
  .filter((name) => name.endsWith('.html'))
  .filter((name) => !name.startsWith('index'))
  .filter((name) => !name.startsWith('post-template'))
  .sort();

fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outRoot, { recursive: true });

let count = 0;
for (const name of files) {
  const { slug, lang } = canonicalSlug(name);
  const html = fs.readFileSync(path.join(blogDir, name), 'utf8');
  const manifest = manifestByLang.get(lang)?.get(slug) || manifestByLang.get('en')?.get(slug) || {};
  const htmlTitle = extract(/<title>([\s\S]*?)\s+—\s+ByteFuture[^<]*<\/title>/i, html)
    || extract(/<meta property="og:title" content="([^"]+)"/i, html).replace(/\s+—\s+ByteFuture.*$/, '');
  const htmlSummary = extract(/<meta name="description" content="([^"]*)"/i, html);
  const htmlCover = extract(/<meta property="og:image" content="([^"]*)"/i, html);
  const { h1, category, date } = extractHeader(html);
  const article = extractArticle(html);
  if (!article) {
    throw new Error(`Failed to extract article from ${name}`);
  }
  const outDir = path.join(outRoot, lang);
  fs.mkdirSync(outDir, { recursive: true });
  const cover = manifest.cover || htmlCover;
  const frontmatter = [
    '---',
    `slug: ${yamlQuote(slug)}`,
    `lang: ${yamlQuote(lang)}`,
    `title: ${yamlQuote(manifest.title || htmlTitle || h1)}`,
    `summary: ${yamlQuote(manifest.summary || htmlSummary)}`,
    `category: ${yamlQuote(manifest.category || category || 'tutorial')}`,
    `date: ${yamlQuote(manifest.date || date || '2026-01-01')}`,
    `cta: ${yamlQuote('https://models.bytefuture.ai/intro.html')}`,
    cover ? `cover: ${yamlQuote(cover)}` : '',
    'draft: false',
    '---',
  ].filter(Boolean).join('\n');
  fs.writeFileSync(path.join(outDir, `${slug}.md`), `${frontmatter}\n\n${article}\n`);
  count += 1;
}

console.log(`Migrated ${count} existing blog HTML files into src/content/writings/.`);
