#!/usr/bin/env node
// Compare two PNGs pixel by pixel. Used to prove a re-rendered cover still
// matches the one that shipped, and to locate the difference when it does not.
//
//   node compare_png.mjs stats <old.png> <new.png>
//   node compare_png.mjs mask  <old.png> <new.png> <out.png>
//   node compare_png.mjs stack <old.png> <new.png> <out.png>
//
// No dependencies: PNG decode and encode are done here with zlib.

import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync, deflateSync } from 'node:zlib';

const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function crcTable() {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
}
const CRC = crcTable();
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};

/** Decode a non-interlaced 8-bit RGB/RGBA PNG into {width, height, rgba}. */
function decodePng(file) {
  const buf = readFileSync(file);
  if (!buf.subarray(0, 8).equals(SIG)) throw new Error(`${file}: not a PNG`);
  let pos = 8, width = 0, height = 0, colorType = 0, bitDepth = 0, interlace = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  if (bitDepth !== 8) throw new Error(`${file}: only 8-bit PNGs supported (got ${bitDepth})`);
  if (interlace !== 0) throw new Error(`${file}: interlaced PNGs not supported`);
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
  if (!channels) throw new Error(`${file}: only RGB/RGBA supported (colour type ${colorType})`);

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);
  let rp = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[rp++];
    const line = raw.subarray(rp, rp + stride); rp += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? cur[i - channels] : 0;
      const b = prev ? prev[i] : 0;
      const c = prev && i >= channels ? prev[i - channels] : 0;
      let v = line[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) v += paeth(a, b, c);
      cur[i] = v & 0xff;
    }
  }
  // Normalise to RGBA so callers do not care about the source channel count.
  if (channels === 4) return { width, height, rgba: out };
  const rgba = Buffer.alloc(width * height * 4);
  for (let p = 0; p < width * height; p++) {
    rgba[p * 4] = out[p * 3];
    rgba[p * 4 + 1] = out[p * 3 + 1];
    rgba[p * 4 + 2] = out[p * 3 + 2];
    rgba[p * 4 + 3] = 255;
  }
  return { width, height, rgba };
}

function encodePng(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const chunk = (type, data) => {
    const out = Buffer.alloc(12 + data.length);
    out.writeUInt32BE(data.length, 0);
    out.write(type, 4, 'ascii');
    data.copy(out, 8);
    out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
    return out;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([SIG, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

const sameSize = (a, b) => a.width === b.width && a.height === b.height;
const delta = (d, e, i) =>
  Math.max(Math.abs(d[i] - e[i]), Math.abs(d[i + 1] - e[i + 1]), Math.abs(d[i + 2] - e[i + 2]));

const [mode, oldPath, newPath, outPath] = process.argv.slice(2);
if (!mode || !oldPath || !newPath) {
  console.error('usage: compare_png.mjs stats|mask|stack <old.png> <new.png> [out.png]');
  process.exit(2);
}
const A = decodePng(oldPath);
const B = decodePng(newPath);

if (mode === 'stats') {
  if (!sameSize(A, B)) {
    console.log(`DIMENSIONS DIFFER: ${A.width}x${A.height} vs ${B.width}x${B.height}`);
    process.exit(1);
  }
  let soft = 0, hard = 0, max = 0;
  for (let i = 0; i < A.rgba.length; i += 4) {
    const d = delta(A.rgba, B.rgba, i);
    if (d > 8) soft++;
    if (d > 64) hard++;
    if (d > max) max = d;
  }
  const total = A.width * A.height;
  const pct = (v) => ((100 * v) / total).toFixed(2) + '%';
  console.log(`size      ${A.width}x${A.height}`);
  console.log(`changed>8  ${pct(soft)}   (antialiasing lives here)`);
  console.log(`changed>64 ${pct(hard)}   (real visual change lives here)`);
  console.log(`max delta  ${max}/255`);
  // Anything past a few tenths of a percent of hard-changed pixels is a
  // layout or colour change, not rasterisation noise.
  process.exit(hard / total > 0.005 ? 1 : 0);
}

if (mode === 'mask') {
  if (!outPath) { console.error('mask needs an output path'); process.exit(2); }
  if (!sameSize(A, B)) { console.error('cannot mask images of different sizes'); process.exit(1); }
  const out = Buffer.alloc(A.rgba.length);
  for (let i = 0; i < A.rgba.length; i += 4) {
    if (delta(A.rgba, B.rgba, i) > 24) {
      out[i] = 255; out[i + 1] = 0; out[i + 2] = 0; out[i + 3] = 255;
    } else {
      // Fade the original so the red stands out against it.
      for (let k = 0; k < 3; k++) out[i + k] = 255 - (255 - A.rgba[i + k]) * 0.15;
      out[i + 3] = 255;
    }
  }
  writeFileSync(outPath, encodePng(A.width, A.height, out));
  console.log(`mask -> ${outPath} (red = changed by more than 24/255)`);
  process.exit(0);
}

if (mode === 'stack') {
  if (!outPath) { console.error('stack needs an output path'); process.exit(2); }
  const gap = 8;
  const width = Math.max(A.width, B.width);
  const height = A.height + gap + B.height;
  const out = Buffer.alloc(width * height * 4, 0);
  const blit = (img, top) => {
    for (let y = 0; y < img.height; y++) {
      img.rgba.copy(out, ((top + y) * width) * 4, y * img.width * 4, (y + 1) * img.width * 4);
    }
  };
  blit(A, 0);
  for (let y = A.height; y < A.height + gap; y++)
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      out[i] = 17; out[i + 1] = 17; out[i + 2] = 17; out[i + 3] = 255;
    }
  blit(B, A.height + gap);
  writeFileSync(outPath, encodePng(width, height, out));
  console.log(`stack -> ${outPath} (before on top, after below)`);
  process.exit(0);
}

console.error(`unknown mode: ${mode}`);
process.exit(2);
