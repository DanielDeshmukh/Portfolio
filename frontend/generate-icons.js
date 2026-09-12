const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUTPUT_DIR = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function createIconSvg(size) {
  const borderRadius = Math.round(size * 0.18);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#111315"/>
      <stop offset="100%" style="stop-color:#1a1a1a"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${borderRadius}" ry="${borderRadius}" fill="url(#bg)"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" 
    font-family="'Courier New', 'Consolas', 'Monaco', monospace" font-weight="700" font-size="${Math.round(size * 0.38)}" 
    fill="#c9a962" letter-spacing="-1">&lt;D/&gt;</text>
</svg>`;
}

async function generateIcons() {
  for (const size of SIZES) {
    const svg = createIconSvg(size);
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    
    console.log(`Generated icon-${size}x${size}.png`);
  }

  // Apple touch icon (180x180)
  const appleSvg = createIconSvg(180);
  await sharp(Buffer.from(appleSvg))
    .png()
    .toFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Favicons
  for (const s of [32, 16]) {
    const favSvg = createIconSvg(s);
    await sharp(Buffer.from(favSvg))
      .png()
      .toFile(path.join(OUTPUT_DIR, `favicon-${s}x${s}.png`));
    console.log(`Generated favicon-${s}x${s}.png`);
  }

  console.log('\nAll icons generated!');
}

generateIcons().catch(console.error);
