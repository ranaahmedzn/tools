/**
 * Image Converter & Resizer
 * 
 * This script reads images from an input directory, resizes them if necessary,
 * converts them to a modern format (like WebP), and saves them to an output directory.
 * 
 * Dependencies:
 * - sharp: High-performance Node.js module for resizing and converting images.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
// Adjust these settings to customize the conversion process
const CONFIG = {
  // Directory containing source images
  inputDir: path.join(__dirname, './original-images'),   
  
  // Directory to save processed images
  outputDir: path.join(__dirname, './converted-images'), 
  
  // Target image format (e.g., 'webp', 'jpeg', 'png', 'avif')
  format: 'webp',                                        
  
  // Output quality (0-100). Higher is better quality but larger file size
  quality: 90,                                           
  
  // Max width to resize to in pixels. Set to null to disable resizing
  maxWidth: 1920,                                        
  
  // Supported input file extensions (case-insensitive)
  supportedExtensions: /\.(jpe?g|png|gif|tiff)$/i        
};

/**
 * Main function to process all images in the input directory
 */
async function processImages() {
  try {
    // 1. Verify input directory exists
    if (!fs.existsSync(CONFIG.inputDir)) {
      console.error(`❌ Input directory not found: ${CONFIG.inputDir}`);
      console.log(`💡 Please create the 'original-images' folder and add some images first.`);
      return;
    }

    // 2. Create output directory if it doesn't exist
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${CONFIG.outputDir}`);
    }

    // 3. Get all supported image files in input directory
    const files = fs.readdirSync(CONFIG.inputDir);
    const imageFiles = files.filter(file => CONFIG.supportedExtensions.test(file));

    if (imageFiles.length === 0) {
      console.log(`⚠️ No supported images found in ${CONFIG.inputDir}.`);
      return;
    }

    console.log(`🔍 Found ${imageFiles.length} images to process. Starting conversion...\n`);

    // 4. Process each image sequentially (prevents memory issues with large batches)
    let successCount = 0;
    let errorCount = 0;

    for (const file of imageFiles) {
      const inputPath = path.join(CONFIG.inputDir, file);
      const outputFileName = `${path.parse(file).name}.${CONFIG.format}`;
      const outputPath = path.join(CONFIG.outputDir, outputFileName);

      try {
        // Initialize sharp pipeline with the input file
        let pipeline = sharp(inputPath);

        // Optional: Resize if maxWidth is set
        if (CONFIG.maxWidth) {
          pipeline = pipeline.resize({
            width: CONFIG.maxWidth,
            // Don't enlarge images that are already smaller than maxWidth
            withoutEnlargement: true 
          });
        }

        // Set format and quality
        pipeline = pipeline.toFormat(CONFIG.format, { quality: CONFIG.quality });

        // Execute the pipeline and save to the output file
        await pipeline.toFile(outputPath);
        
        console.log(`✅ Success: ${file} → ${outputFileName}`);
        successCount++;
      } catch (err) {
        console.error(`❌ Error processing ${file}:`, err.message);
        errorCount++;
      }
    }

    // 5. Print a final summary of the operation
    console.log(`\n🎉 Processing complete!`);
    console.log(`📊 Summary: ${successCount} successful, ${errorCount} failed.`);
    console.log(`📂 Check the results in: ${CONFIG.outputDir}`);

  } catch (error) {
    console.error('❌ An unexpected error occurred:', error);
  }
}

// Execute the script
processImages();
