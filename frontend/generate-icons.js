const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUTPUT_DIR = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function createIconSvg(size) {
  const padding = Math.round(size * 0.15);
  const fontSize = Math.round(size * 0.55);
  const borderRadius = Math.round(size * 0.18);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#111315"/>
      <stop offset="100%" style="stop-color:#1a1a1a"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#c9a962"/>
      <stop offset="100%" style="stop-color:#e8d5a3"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${borderRadius}" ry="${borderRadius}" fill="url(#bg)"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" 
    font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="${fontSize}" 
    fill="url(#gold)" letter-spacing="-2">D</text>
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

  // Generate Apple touch icon (180x180)
  const appleSvg = createIconSvg(180);
  await sharp(Buffer.from(appleSvg))
    .png()
    .toFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Generate favicon (32x32)
  const favSvg = createIconSvg(32);
  await sharp(Buffer.from(favSvg))
    .png()
    .toFile(path.join(OUTPUT_DIR, 'favicon-32x32.png'));
  console.log('Generated favicon-32x32.png');

  // Generate favicon (16x16)
  const fav16Svg = createIconSvg(16);
  await sharp(Buffer.from(fav16Svg))
    .png()
    .toFile(path.join(OUTPUT_DIR, 'favicon-16x16.png'));
  console.log('Generated favicon-16x16.png');

  console.log('\nAll icons generated!');
}

generateIcons().catch(console.error);
