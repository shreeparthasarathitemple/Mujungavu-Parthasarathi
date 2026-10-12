// One-time image optimisation: run `npm run optimize-images` after adding big photos to public/.
// Resizes large JPGs in place, converts photo PNGs to JPG, and creates og-image.jpg (1200x630).
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve('public');
const MAX_WIDTH = 1600;
const MIN_BYTES = 300 * 1024; // only touch files bigger than this

const jpeg = (img) => img.resize({ width: MAX_WIDTH, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true });

const optimiseJpg = async (file) => {
  const before = fs.statSync(file).size;
  if (before < MIN_BYTES) return;
  const buf = await jpeg(sharp(file).rotate()).toBuffer();
  if (buf.length < before) {
    fs.writeFileSync(file, buf);
    console.log(`${path.relative(PUBLIC_DIR, file)}: ${(before / 1e6).toFixed(2)}MB -> ${(buf.length / 1e6).toFixed(2)}MB`);
  }
};

const pngToJpg = async (file) => {
  const out = file.replace(/\.png$/, '.jpg');
  await jpeg(sharp(file).rotate().flatten({ background: '#ffffff' })).toFile(out);
  console.log(`${path.relative(PUBLIC_DIR, file)} -> ${path.relative(PUBLIC_DIR, out)} (${(fs.statSync(out).size / 1e6).toFixed(2)}MB)`);
};

const galleryDir = path.join(PUBLIC_DIR, 'gallery');
for (const name of fs.readdirSync(galleryDir)) {
  const file = path.join(galleryDir, name);
  if (/\.jpe?g$/i.test(name)) await optimiseJpg(file);
  if (/\.png$/i.test(name) && fs.statSync(file).size >= MIN_BYTES) await pngToJpg(file);
}
for (const name of ['lord.png']) {
  const file = path.join(PUBLIC_DIR, name);
  if (fs.existsSync(file)) await pngToJpg(file);
}
for (const name of ['videos/hero-lap-poster.jpg']) {
  const file = path.join(PUBLIC_DIR, name);
  if (fs.existsSync(file)) await optimiseJpg(file);
}

// Social share preview image
await sharp(path.join(galleryDir, 'mujungavu-temple-entrance.png'))
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(path.join(PUBLIC_DIR, 'og-image.jpg'));
console.log('og-image.jpg created');

// Favicon: 549KB is far too big for an icon
const favicon = path.join(PUBLIC_DIR, 'favicon.png');
const favBuf = await sharp(favicon).resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ palette: true, compressionLevel: 9 }).toBuffer();
fs.writeFileSync(favicon, favBuf);
console.log(`favicon.png -> ${(favBuf.length / 1024).toFixed(0)}KB`);
