/**
 * Génère les icônes PWA de Kalimati (PNG) sans aucune dépendance :
 * un petit rasteriseur + encodeur PNG (zlib natif de Node).
 *
 * Motif : étoile à huit branches (khātim / rub el hizb), motif géométrique
 * arabe classique, crème sur fond sauge, avec un cœur doré.
 *
 * Usage : npm run icons   (écrit dans public/icons/)
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../public/icons");

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const BG_TOP = hex("#7BA276");
const BG_BOTTOM = hex("#4A7047");
const CREAM = hex("#FBF8F1");
const SAGE = hex("#5F8A5B");
const GOLD = hex("#E3C878");

// ── Géométrie (coordonnées normalisées : centre (0,0), bord ±1) ──────────
function inSquare(x, y, half, angle) {
  const c = Math.cos(-angle);
  const s = Math.sin(-angle);
  const rx = x * c - y * s;
  const ry = x * s + y * c;
  return Math.abs(rx) <= half && Math.abs(ry) <= half;
}
const inStar = (x, y, half) => inSquare(x, y, half, 0) || inSquare(x, y, half, Math.PI / 4);
const inCircle = (x, y, r) => x * x + y * y <= r * r;
function inRoundedRect(x, y, half, radius) {
  const qx = Math.abs(x) - (half - radius);
  const qy = Math.abs(y) - (half - radius);
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) <= radius;
}

/** Couleur (RGBA) d'un point, ou null si transparent. `scale` réduit le motif (zone sûre maskable). */
function sample(x, y, { rounded, scale }) {
  if (rounded && !inRoundedRect(x, y, 1, 0.42)) return null;
  const t = (y + 1) / 2;
  let color = BG_TOP.map((v, i) => Math.round(v + (BG_BOTTOM[i] - v) * t));
  const sx = x / scale;
  const sy = y / scale;
  if (inStar(sx, sy, 0.5)) color = CREAM;
  if (inStar(sx, sy, 0.36)) color = SAGE;
  if (inCircle(sx, sy, 0.2)) color = GOLD;
  return [...color, 255];
}

function render(size, opts) {
  const SS = 4; // supersampling 4×4 pour l'anticrénelage
  const px = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let pxi = 0; pxi < size; pxi++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = ((pxi + (sx + 0.5) / SS) / size) * 2 - 1;
          const y = ((py + (sy + 0.5) / SS) / size) * 2 - 1;
          const c = sample(x, y, opts);
          if (!c) continue;
          r += c[0]; g += c[1]; b += c[2]; a += 255;
        }
      }
      const n = SS * SS;
      const i = (py * size + pxi) * 4;
      const covered = a / 255;
      px[i] = covered ? Math.round(r / covered) : 0;
      px[i + 1] = covered ? Math.round(g / covered) : 0;
      px[i + 2] = covered ? Math.round(b / covered) : 0;
      px[i + 3] = Math.round(a / n);
    }
  }
  return encodePng(size, size, px);
}

// ── Encodeur PNG minimal ─────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([len, typeAndData, crc]);
}
function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // profondeur
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filtre "none"
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Sorties ──────────────────────────────────────────────────────────────
mkdirSync(OUT_DIR, { recursive: true });
const targets = [
  { file: "icon-192.png", size: 192, rounded: true, scale: 1 },
  { file: "icon-512.png", size: 512, rounded: true, scale: 1 },
  // Maskable : plein cadre, motif réduit pour rester dans la zone sûre (80 %).
  { file: "icon-maskable-512.png", size: 512, rounded: false, scale: 0.78 },
  { file: "apple-touch-icon.png", size: 180, rounded: false, scale: 0.9 },
];
for (const { file, size, rounded, scale } of targets) {
  writeFileSync(resolve(OUT_DIR, file), render(size, { rounded, scale }));
  console.log(`✓ public/icons/${file}`);
}
