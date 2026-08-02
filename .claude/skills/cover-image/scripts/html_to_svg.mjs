#!/usr/bin/env node
// Convert an HTML cover source into a standalone SVG of the same artwork.
//
//   npm install puppeteer-core          # one-off, in a scratch directory
//   node html_to_svg.mjs <in.html> <out.svg>
//   node html_to_svg.mjs <in-dir> <out-dir>       # every *-cover.html
//
// It opens the page in headless Chrome and measures the real layout: every
// text run's baseline, every box's rect, radius, border, shadow, and
// transform. That is the only way to reproduce artwork faithfully, because
// HTML sizes boxes from their content and SVG cannot.
//
// Always diff the result against the PNG that shipped (see compare_png.mjs).
// This is a migration aid, not a build step; once the SVG exists it is the
// source and this script is not needed again.

import puppeteer from 'puppeteer-core';
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const CHROME_CANDIDATES = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n = (v) => (Math.round(v * 100) / 100).toString();

// ---------------------------------------------------------------- measure

const scrape = () => {
  const px = (v) => (v == null ? 0 : parseFloat(v) || 0);
  const vis = (c) => c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent';

  // Inline SVGs style their text with CSS classes that will not exist in the
  // output file, so bake the computed font onto each <text> and capture the
  // markup before the transform-stripping pass below mutates anything.
  const svgInner = new Map();
  for (const svg of document.querySelectorAll('svg')) {
    for (const t of svg.querySelectorAll('text')) {
      const ts = getComputedStyle(t);
      t.setAttribute('font-family', ts.fontFamily.replace(/"/g, "'"));
      t.setAttribute('font-size', parseFloat(ts.fontSize));
      t.setAttribute('font-weight', ts.fontWeight);
      if (ts.letterSpacing !== 'normal' && parseFloat(ts.letterSpacing))
        t.setAttribute('letter-spacing', parseFloat(ts.letterSpacing) + 'px');
      t.setAttribute('fill', ts.fill || ts.color);
      t.removeAttribute('class');
    }
    svgInner.set(svg, svg.innerHTML);
  }

  // Record transforms, then strip them so getBoundingClientRect reports
  // layout boxes rather than rotated bounding boxes.
  const transforms = new Map();
  for (const el of document.querySelectorAll('*')) {
    const t = getComputedStyle(el).transform;
    if (t && t !== 'none') transforms.set(el, t);
    if (!(el instanceof SVGElement)) el.style.transform = 'none';
  }

  const ctx = document.createElement('canvas').getContext('2d');
  const ascentOf = (cs, text) => {
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    return ctx.measureText(text).fontBoundingBoxAscent;
  };

  const nodes = [];
  // A CSS transform applies to the whole subtree, so children of a rotated
  // card must rotate about that card's centre, not their own.
  const walk = (el, inherited) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const r = el.getBoundingClientRect();
    const cls = el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className;
    const own = transforms.get(el);
    const rot = own ? { t: own, cx: r.x + r.width / 2, cy: r.y + r.height / 2 } : inherited;

    if (el.tagName.toLowerCase() === 'svg') {
      const attrs = {};
      for (const a of el.attributes) {
        if (!['class', 'style', 'width', 'height', 'x', 'y', 'viewBox'].includes(a.name)) attrs[a.name] = a.value;
      }
      nodes.push({
        kind: 'svg', cls, x: r.x, y: r.y, w: r.width, h: r.height,
        viewBox: el.getAttribute('viewBox'), inner: svgInner.get(el) ?? el.innerHTML, attrs,
        opacity: px(cs.opacity) === 1 ? undefined : px(cs.opacity),
      });
      return;
    }

    const hasBg = vis(cs.backgroundColor);
    const hasBorder = px(cs.borderTopWidth) > 0 && vis(cs.borderTopColor);
    const bgImage = cs.backgroundImage !== 'none' ? cs.backgroundImage : undefined;
    if (hasBg || hasBorder || bgImage) {
      nodes.push({
        kind: 'box', cls, x: r.x, y: r.y, w: r.width, h: r.height,
        fill: hasBg ? cs.backgroundColor : undefined,
        stroke: hasBorder ? cs.borderTopColor : undefined,
        strokeWidth: hasBorder ? px(cs.borderTopWidth) : undefined,
        radius: px(cs.borderTopLeftRadius),
        shadow: cs.boxShadow !== 'none' ? cs.boxShadow : undefined,
        bgImage, bgSize: bgImage ? cs.backgroundSize : undefined, rot,
      });
    }

    const pb = getComputedStyle(el, '::before');
    if (pb.content && pb.content !== 'none' && px(pb.width) > 0) {
      nodes.push({
        kind: 'pseudo', cls, parentX: r.x, parentY: r.y, parentW: r.width, parentH: r.height,
        // A full-bleed ::before is clipped by the parent's radius and overflow,
        // so it has to be drawn as the parent's rounded rect, not a plain box.
        parentRadius: px(cs.borderTopLeftRadius), parentBorder: px(cs.borderTopWidth),
        top: px(pb.top), left: px(pb.left), w: px(pb.width), h: px(pb.height),
        fill: pb.backgroundColor, stroke: pb.borderTopColor,
        strokeWidth: px(pb.borderTopWidth), image: pb.backgroundImage, rot,
      });
    }

    for (const child of el.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const raw = child.textContent;
        if (!raw || !raw.trim()) continue;
        // Group characters into line boxes: SVG has no wrapping, so each
        // visual line has to become its own <text>.
        const lines = [];
        for (let i = 0; i < raw.length; i++) {
          const rg = document.createRange();
          rg.setStart(child, i);
          rg.setEnd(child, i + 1);
          const rect = rg.getBoundingClientRect();
          if (!rect.height) continue;
          let line = lines.find((l) => Math.abs(l.top - Math.round(rect.top)) < 2);
          if (!line) { line = { top: rect.top, x: Infinity, chars: [] }; lines.push(line); }
          line.chars.push(raw[i]);
          if (!/\s/.test(raw[i])) line.x = Math.min(line.x, rect.x);
        }
        for (const line of lines) {
          let text = line.chars.join('').replace(/\s+/g, ' ').trim();
          if (!text) continue;
          if (cs.textTransform === 'uppercase') text = text.toUpperCase();
          nodes.push({
            kind: 'text', cls, text, x: line.x, baseline: line.top + ascentOf(cs, text),
            family: cs.fontFamily, size: px(cs.fontSize), weight: cs.fontWeight,
            style: cs.fontStyle, fill: cs.color,
            letterSpacing: cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing), rot,
          });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child, rot);
      }
    }
  };

  for (const child of document.body.children) walk(child, undefined);

  // Font @imports can sit in an inline <style> or in a linked stylesheet;
  // collect both, or the SVG renders in fallback metrics.
  const imports = new Set();
  for (const st of document.querySelectorAll('style')) {
    for (const m of st.textContent.matchAll(/@import\s+url\((['"]?)([^'")]+)\1\)/g)) imports.add(m[2]);
  }
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.type === CSSRule.IMPORT_RULE && rule.href) imports.add(rule.href);
      }
    } catch { /* opaque origin: the caller reads these off disk instead */ }
  }
  const links = [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href'));

  const body = getComputedStyle(document.body);
  return {
    nodes, imports: [...imports], links,
    width: parseFloat(body.width), height: parseFloat(body.height), background: body.backgroundColor,
  };
};

// ------------------------------------------------------------------- emit

function rgbaSplit(color) {
  const m = color && color.match(/rgba?\(([^,]+),([^,]+),([^,]+)(?:,([^)]+))?\)/);
  if (!m) return { hex: color || 'none', op: 1 };
  return { hex: `rgb(${m[1].trim()},${m[2].trim()},${m[3].trim()})`, op: m[4] === undefined ? 1 : parseFloat(m[4]) };
}

/**
 * CSS linear-gradient(<angle>deg, ...) over a box, as an SVG linearGradient.
 * CSS angles run clockwise from "to top", so the direction is (sin a, -cos a)
 * in screen coordinates, and the gradient line is centred on the box.
 */
function linearGradientDef(id, box, css) {
  const stops = [...css.matchAll(/(rgba?\([^)]*\)|#[0-9a-f]{3,8})\s+([\d.]+)%/gi)];
  if (stops.length < 2) return null;
  const angle = css.match(/([-\d.]+)deg/);
  const a = ((angle ? parseFloat(angle[1]) : 180) * Math.PI) / 180;
  const dx = Math.sin(a), dy = -Math.cos(a);
  const len = Math.abs(box.w * Math.sin(a)) + Math.abs(box.h * Math.cos(a));
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  const inner = stops.map((s) => {
    const { hex, op } = rgbaSplit(s[1]);
    return `      <stop offset="${n(parseFloat(s[2]) / 100)}" stop-color="${hex}" stop-opacity="${n(op)}"/>`;
  }).join('\n');
  return `    <linearGradient id="${id}" gradientUnits="userSpaceOnUse" ` +
    `x1="${n(cx - (dx * len) / 2)}" y1="${n(cy - (dy * len) / 2)}" ` +
    `x2="${n(cx + (dx * len) / 2)}" y2="${n(cy + (dy * len) / 2)}">\n${inner}\n    </linearGradient>`;
}

const rotOf = (rot) => {
  if (!rot) return '';
  const m = rot.t.match(/matrix\(([^)]+)\)/);
  if (!m) return '';
  const [a, b, , , e, f] = m[1].split(',').map(parseFloat);
  const deg = (Math.atan2(b, a) * 180) / Math.PI;
  const parts = [];
  // Layout boxes were measured with transforms stripped, so both the
  // translation and the rotation have to be put back.
  if (Math.abs(e) > 0.01 || Math.abs(f) > 0.01) parts.push(`translate(${n(e)} ${n(f)})`);
  if (Math.abs(deg) > 0.01) parts.push(`rotate(${n(deg)} ${n(rot.cx)} ${n(rot.cy)})`);
  return parts.length ? ` transform="${parts.join(' ')}"` : '';
};

function emit(scene, name) {
  const defs = [];
  const body = [];
  let gradN = 0, filtN = 0, gridDone = false;

  const bg = rgbaSplit(scene.background);
  body.push(`  <rect width="${n(scene.width)}" height="${n(scene.height)}" fill="${bg.hex}"/>`);

  for (const node of scene.nodes) {
    if (node.kind === 'box' && node.bgImage && /gradient/.test(node.bgImage) && node.bgSize !== 'auto') {
      if (!gridDone) {
        // A repeating dot: one circle per tile, centred.
        const dot = node.bgImage.match(/(rgba?\([^)]*\))\s+([\d.]+)px/);
        if (dot) {
          const { hex, op } = rgbaSplit(dot[1]);
          const [tw, th] = node.bgSize.split(' ').map(parseFloat);
          defs.push(`    <pattern id="grid" width="${n(tw)}" height="${n(th)}" patternUnits="userSpaceOnUse">
      <circle cx="${n(tw / 2)}" cy="${n(th / 2)}" r="${dot[2]}" fill="${hex}" fill-opacity="${op}"/>
    </pattern>`);
          body.push(`  <rect x="${n(node.x)}" y="${n(node.y)}" width="${n(node.w)}" height="${n(node.h)}" fill="url(#grid)"/>`);
          gridDone = true;
        }
      }
      continue;
    }

    if (node.kind === 'box' && node.bgImage && /radial-gradient/.test(node.bgImage)) {
      // CSS radial-gradient(circle, ...) with no extent keyword reaches the
      // farthest corner, so the SVG radius is the box half-diagonal.
      const stops = [...node.bgImage.matchAll(/(rgba?\([^)]*\)|transparent)\s+([\d.]+)%/g)];
      if (!stops.length) continue;
      const id = `wash${++gradN}`;
      const inner = stops.map((s) => {
        const { hex, op } = rgbaSplit(s[1] === 'transparent' ? 'rgba(0,0,0,0)' : s[1]);
        return `      <stop offset="${n(parseFloat(s[2]) / 100)}" stop-color="${hex}" stop-opacity="${n(op)}"/>`;
      }).join('\n');
      defs.push(`    <radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${n(node.x + node.w / 2)}" cy="${n(node.y + node.h / 2)}" r="${n(Math.hypot(node.w / 2, node.h / 2))}">\n${inner}\n    </radialGradient>`);
      body.push(`  <rect x="${n(node.x)}" y="${n(node.y)}" width="${n(node.w)}" height="${n(node.h)}" fill="url(#${id})"/>`);
      continue;
    }

    if (node.kind === 'box' && node.bgImage && /linear-gradient/.test(node.bgImage)) {
      const id = `lg${++gradN}`;
      const def = linearGradientDef(id, node, node.bgImage);
      if (def) {
        defs.push(def);
        body.push(`  <rect x="${n(node.x)}" y="${n(node.y)}" width="${n(node.w)}" height="${n(node.h)}" rx="${n(node.radius || 0)}" fill="url(#${id})"${rotOf(node.rot)}/>`);
      }
      continue;
    }

    if (node.kind === 'box') {
      const sw = node.strokeWidth || 0;
      const rx = Math.min(node.radius, (node.h - sw) / 2);
      let filter = '';
      if (node.shadow) {
        const m = node.shadow.match(/(rgba?\([^)]*\))\s+([-\d.]+)px\s+([-\d.]+)px\s+([-\d.]+)px/);
        if (m) {
          const { hex, op } = rgbaSplit(m[1]);
          defs.push(`    <filter id="sh${++filtN}" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="${n(+m[2])}" dy="${n(+m[3])}" stdDeviation="${n(+m[4] / 2)}" flood-color="${hex}" flood-opacity="${n(op)}"/>
    </filter>`);
          filter = ` filter="url(#sh${filtN})"`;
        }
      }
      // CSS borders sit inside the box; SVG strokes straddle the path.
      body.push(`  <rect x="${n(node.x + sw / 2)}" y="${n(node.y + sw / 2)}" width="${n(node.w - sw)}" height="${n(node.h - sw)}" rx="${n(rx)}"` +
        `${node.fill ? ` fill="${node.fill}"` : ' fill="none"'}${sw ? ` stroke="${node.stroke}" stroke-width="${n(sw)}"` : ''}${filter}${rotOf(node.rot)}/>`);
      continue;
    }

    if (node.kind === 'pseudo') {
      const url = node.image && node.image.match(/url\((?:"([^"]+)"|'([^']+)'|([^)]+))\)/);
      const href = url && (url[1] || url[2] || url[3] || '').trim();
      const linear = node.image && /linear-gradient/.test(node.image);
      if (href && href.startsWith('data:')) {
        body.push(`  <image x="${n(node.parentX)}" y="${n(node.parentY + node.top)}" width="${n(node.w)}" height="${n(node.h)}" href="${esc(href)}"/>`);
      } else if (linear) {
        // A full-bleed gradient overlay: draw it as the parent's rounded rect
        // so the parent's border-radius and overflow:hidden are honoured.
        const bw = node.parentBorder || 0;
        const box = { x: node.parentX + bw, y: node.parentY + bw, w: node.w, h: node.h };
        const id = `lg${++gradN}`;
        const def = linearGradientDef(id, box, node.image);
        if (def) {
          defs.push(def);
          // Allow for the border when deciding whether it fills the parent.
          const covers = Math.abs(node.w - (node.parentW - 2 * bw)) < 1.5 && Math.abs(node.h - (node.parentH - 2 * bw)) < 1.5;
          const rx = covers ? Math.max(0, (node.parentRadius || 0) - bw) : 0;
          body.push(`  <rect x="${n(box.x)}" y="${n(box.y)}" width="${n(box.w)}" height="${n(box.h)}" rx="${n(rx)}" fill="url(#${id})"${rotOf(node.rot)}/>`);
        }
      } else {
        const r = node.w / 2 - node.strokeWidth / 2;
        body.push(`  <circle cx="${n(node.parentX + node.parentW / 2)}" cy="${n(node.parentY + node.top + node.h / 2)}" r="${n(r)}" fill="${node.fill}" stroke="${node.stroke}" stroke-width="${n(node.strokeWidth)}"${rotOf(node.rot)}/>`);
      }
      continue;
    }

    if (node.kind === 'svg') {
      const op = node.opacity !== undefined ? ` opacity="${n(node.opacity)}"` : '';
      const extra = Object.entries(node.attrs || {}).map(([k, v]) => ` ${k}="${v}"`).join('');
      const inner = node.inner.trim().split('\n').map((l) => '    ' + l.trim()).join('\n');
      body.push(`  <svg x="${n(node.x)}" y="${n(node.y)}" width="${n(node.w)}" height="${n(node.h)}" viewBox="${node.viewBox}"${extra}${op}>\n${inner}\n  </svg>`);
      continue;
    }

    if (node.kind === 'text') {
      // px is required: Chrome parses this as CSS, where a unitless non-zero
      // length is invalid and the declaration is dropped silently.
      const ls = node.letterSpacing ? ` letter-spacing="${n(node.letterSpacing)}px"` : '';
      const st = node.style !== 'normal' ? ` font-style="${node.style}"` : '';
      body.push(`  <text x="${n(node.x)}" y="${n(node.baseline)}" font-family="${node.family.replace(/"/g, "'")}" ` +
        `font-size="${n(node.size)}" font-weight="${node.weight}"${st}${ls} fill="${node.fill}"${rotOf(node.rot)}>${esc(node.text)}</text>`);
    }
  }

  const style = scene.fonts ? `  <style>\n${scene.fonts}\n  </style>\n` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${n(scene.width)}" height="${n(scene.height)}" viewBox="0 0 ${n(scene.width)} ${n(scene.height)}">
  <title>${esc(name)}</title>
${style}  <defs>
${defs.join('\n')}
  </defs>
${body.join('\n')}
</svg>
`;
}

// ------------------------------------------------------------------- main

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: html_to_svg.mjs <in.html|in-dir> <out.svg|out-dir>');
  process.exit(2);
}

let executablePath = null;
for (const c of CHROME_CANDIDATES) {
  try { await stat(c); executablePath = c; break; } catch {}
}
if (!executablePath) {
  console.error('Chrome not found. Set CHROME=/path/to/chrome and retry.');
  process.exit(1);
}

const inputIsDir = (await stat(input)).isDirectory();
const jobs = inputIsDir
  ? (await readdir(input)).filter((f) => f.endsWith('.html')).map((f) => ({
      src: path.join(input, f), dst: path.join(output, f.replace(/\.html$/, '.svg')),
    }))
  : [{ src: input, dst: output }];

if (inputIsDir) await mkdir(output, { recursive: true });
else await mkdir(path.dirname(output), { recursive: true });

const browser = await puppeteer.launch({ executablePath, headless: 'new', args: ['--disable-gpu'] });
for (const job of jobs) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(job.src), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const scene = await page.evaluate(scrape);
  // A file:// stylesheet is an opaque origin, so its @import is unreadable from
  // the page. Read any linked sheet off disk and pull the imports out here.
  for (const href of scene.links || []) {
    if (!href || /^https?:/i.test(href)) continue;
    try {
      const css = await readFile(path.resolve(path.dirname(job.src), href), 'utf8');
      for (const m of css.matchAll(/@import\s+url\((['"]?)([^'")]+)\1\)/g)) {
        if (!scene.imports.includes(m[2])) scene.imports.push(m[2]);
      }
    } catch { /* linked sheet missing; the size check will catch the fallout */ }
  }
  scene.fonts = (scene.imports || [])
    .map((u) => `    @import url('${u.replace(/&/g, '&amp;')}');`)
    .join('\n') || null;
  const name = path.basename(job.dst, '.svg');
  await writeFile(job.dst, emit(scene, name));
  console.log(`${job.src} -> ${job.dst}  (${scene.nodes.length} nodes, ${scene.width}x${scene.height})`);
  await page.close();
}
await browser.close();
console.log('\nNow render each SVG and diff it against the PNG that shipped:');
console.log('  ./render_cover.sh <out.svg> /tmp/check.png');
console.log('  node compare_png.mjs stats <shipped.png> /tmp/check.png');
