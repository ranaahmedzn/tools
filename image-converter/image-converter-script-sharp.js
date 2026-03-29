const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, './original-images'); // Current root directory
const outputDir = path.join(__dirname, './converted-images'); // New folder for converted images

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all JPG and PNG files in input directory
const imageFiles = fs.readdirSync(inputDir).filter(file =>
  /\.(jpe?g|png)$/i.test(file)
);

console.log(`Found ${imageFiles.length} images to convert.`);

imageFiles.forEach(file => {
  const inputPath = path.join(inputDir, file);
  const outputFileName = path.parse(file).name + '.webp';
  const outputPath = path.join(outputDir, outputFileName);

  sharp(inputPath)
    .webp({ quality: 90 }) // Adjust quality (0-100)
    .toFile(outputPath)
    .then(() => {
      console.log(`✅ Converted ${file} → ${outputFileName}`);
    })
    .catch(err => {
      console.error(`❌ Error converting ${file}:`, err);
    });
});
