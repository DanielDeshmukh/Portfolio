const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SOURCE = path.join(__dirname, '..', '70829872-8688-47f5-ac25-0d8a714c0244.png');
const SIZES = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];
const OUTPUT_DIR = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generateIcon(size) {
  const pad = Math.max(2, Math.round(size * 0.04));
  const inner = size - pad * 2;
  const radius = Math.round(inner * 0.22);

  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${inner}" height="${inner}">
    <rect width="${inner}" height="${inner}" rx="${radius}" ry="${radius}" fill="white"/>
  </svg>`;

  const resized = await sharp(SOURCE)
    .resize(inner, inner, { fit: 'cover' })
    .png()
    .toBuffer();

  const maskBuf = await sharp(Buffer.from(maskSvg)).png().toBuffer();

  const masked = await sharp(resized)
    .composite([{ input: maskBuf, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const shadowDy = Math.max(1, Math.round(size * 0.015));
  const shadowStd = Math.max(1, Math.round(size * 0.02));

  const canvasSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs>
      <filter id="s" x="-10%" y="-5%" width="120%" height="130%">
        <feDropShadow dx="0" dy="${shadowDy}" stdDeviation="${shadowStd}" flood-color="#000" flood-opacity="0.45"/>
      </filter>
    </defs>
    <g filter="url(#s)">
      <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" rx="${radius}" ry="${radius}" fill="#111315"/>
    </g>
  </svg>`;

  const canvasBuf = await sharp(Buffer.from(canvasSvg))
    .resize(size, size)
    .png()
    .toBuffer();

  const final = await sharp(canvasBuf)
    .composite([
      { input: masked, left: pad, top: pad, blend: 'over' },
    ])
    .png()
    .toBuffer();

  return final;
}

async function generateIcons() {
  for (const size of SIZES) {
    const outputPath = size === 180
      ? path.join(OUTPUT_DIR, 'apple-touch-icon.png')
      : size <= 32
      ? path.join(OUTPUT_DIR, `favicon-${size}x${size}.png`)
      : path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);

    const buf = await generateIcon(size);
    await sharp(buf).png().toFile(outputPath);
    console.log(`✓ ${path.basename(outputPath)} (${size}x${size})`);
  }
  console.log('\nDone!');
}

generateIcons().catch(console.error);
