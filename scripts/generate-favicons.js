const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImage = path.join(__dirname, '../public/meme soundboard.png');
const outputDir = path.join(__dirname, '../public');

// Favicon sizes to generate
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 150, name: 'mstile-150x150.png' },
];

async function generateFavicons() {
  try {
    console.log('Generating favicons from:', inputImage);
    
    if (!fs.existsSync(inputImage)) {
      console.error('Input image not found:', inputImage);
      process.exit(1);
    }

    // Generate all sizes
    for (const { size, name } of sizes) {
      const outputPath = path.join(outputDir, name);
      await sharp(inputImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      console.log(`Generated: ${name} (${size}x${size})`);
    }

    // Generate favicon.ico (16x16 and 32x32 combined)
    const favicon16 = await sharp(inputImage)
      .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    
    const favicon32 = await sharp(inputImage)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    // For now, just copy 32x32 as favicon.ico (browsers will handle it)
    await sharp(favicon32).toFile(path.join(outputDir, 'favicon.ico'));
    console.log('Generated: favicon.ico');

    console.log('✅ All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
