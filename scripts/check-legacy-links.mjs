import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const sourceBlog = path.join(root, 'blog');
const migratedRoot = path.join(root, 'src/content/writings');

function walkHtml(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walkHtml(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

function migratedRoutes() {
  const routes = [];
  if (!fs.existsSync(migratedRoot)) return routes;
  for (const lang of fs.readdirSync(migratedRoot)) {
    const dir = path.join(migratedRoot, lang);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const slug = path.basename(file, '.md');
      const suffix = lang === 'en' ? '' : `-${lang}`;
      routes.push(`blog/${slug}${suffix}.html`);
    }
  }
  return routes.sort();
}

const sourceFiles = walkHtml(sourceBlog).map((p) => path.relative(root, p));
const missing = [];
for (const rel of sourceFiles) {
  const built = path.join(dist, rel);
  if (!fs.existsSync(built)) missing.push(rel);
}

for (const rel of ['index.html', 'index-zh.html', 'index-ja.html', 'index-ko.html', 'posts.json', 'posts-zh.json', 'posts-ja.json', 'posts-ko.json', 'CNAME', '.nojekyll']) {
  if (!fs.existsSync(path.join(dist, rel))) missing.push(rel);
}

const migrated = migratedRoutes();
const notAstro = [];
for (const rel of migrated) {
  const html = fs.readFileSync(path.join(dist, rel), 'utf8');
  if (!html.includes('Hybrid AI inference for AI agents.')) notAstro.push(rel);
  if (html.includes('cdn.tailwindcss.com')) notAstro.push(`${rel} still contains legacy Tailwind CDN marker`);
}

if (missing.length || notAstro.length) {
  if (missing.length) {
    console.error('Missing legacy outputs:');
    for (const rel of missing) console.error(`- ${rel}`);
  }
  if (notAstro.length) {
    console.error('Migrated routes were not rendered by Astro layout:');
    for (const rel of notAstro) console.error(`- ${rel}`);
  }
  process.exit(1);
}

console.log(`Legacy URL check passed: ${sourceFiles.length} existing blog HTML URLs exist; ${migrated.length} article URLs are rendered by Astro.`);
