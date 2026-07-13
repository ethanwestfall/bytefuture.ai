import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const sourceBlog = path.join(root, 'blog');
const distBlog = path.join(dist, 'blog');

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

const sourceFiles = walkHtml(sourceBlog).map((p) => path.relative(root, p));
const missing = [];
for (const rel of sourceFiles) {
  const built = path.join(dist, rel);
  if (!fs.existsSync(built)) missing.push(rel);
}

for (const rel of ['index.html', 'index-zh.html', 'index-ja.html', 'index-ko.html', 'posts.json', 'posts-zh.json', 'posts-ja.json', 'posts-ko.json', 'CNAME', '.nojekyll']) {
  if (!fs.existsSync(path.join(dist, rel))) missing.push(rel);
}

if (missing.length) {
  console.error('Missing legacy outputs:');
  for (const rel of missing) console.error(`- ${rel}`);
  process.exit(1);
}

console.log(`Legacy link check passed: ${sourceFiles.length} blog HTML files plus root assets exist in dist/.`);
