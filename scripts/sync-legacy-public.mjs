import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const skip = new Set(['.git', 'node_modules', 'dist', 'public', '.astro']);
const copyNames = [
  'index.html',
  'index-zh.html',
  'index-ja.html',
  'index-ko.html',
  'posts.json',
  'posts-zh.json',
  'posts-ja.json',
  'posts-ko.json',
  'CNAME',
  '.nojekyll',
  'robots.txt',
  'sitemap.xml',
  'blog',
  'family_health',
  'legal_sme',
];

function rmrf(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      if (skip.has(name)) continue;
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

rmrf(publicDir);
fs.mkdirSync(publicDir, { recursive: true });

for (const name of copyNames) {
  const src = path.join(root, name);
  if (!fs.existsSync(src)) continue;
  copyRecursive(src, path.join(publicDir, name));
}

console.log(`Synced legacy static assets into ${path.relative(root, publicDir)}/`);
