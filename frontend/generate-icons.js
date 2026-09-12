const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SOURCE = path.join(__dirname, '..', 'Group 53.png');
const SIZES = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];
const OUTPUT_DIR = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generateIcons() {
  for (const size of SIZES) {
    const outputPath = size === 180
      ? path.join(OUTPUT_DIR, 'apple-touch-icon.png')
      : size <= 32
      ? path.join(OUTPUT_DIR, `favicon-${size}x${size}.png`)
      : path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);

    await sharp(SOURCE)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(outputPath);

    console.log(`✓ ${path.basename(outputPath)} (${size}x${size})`);
  }

  console.log('\nDone!');
}

generateIcons().catch(console.error);
