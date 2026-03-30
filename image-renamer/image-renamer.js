/**
 * Bulk Image Renamer & Converter
 * 
 * This script renames all images in a target directory sequentially 
 * based on a provided prefix. It can also optionally convert them to 
 * a specific format (e.g. webp, jpg) on the fly.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// --- Configuration ---
// Adjust these settings to customize the process
const CONFIG = {
  // Directory containing images to rename/convert
  targetDir: path.join(__dirname, './target-images'),   
  
  // Prefix for the new file names
  prefix: 'project',                                     
  
  // Starting number for the sequence
  startNumber: 1,                                       
  
  // Target format (e.g., 'webp', 'jpeg', 'png'). 
  // Set to null or leave empty to keep the original file extensions
  targetFormat: 'webp',
  
  // Output quality (0-100) if targetFormat is set
  quality: 90,

  // Supported input file extensions (case-insensitive)
  supportedExtensions: /\.(jpe?g|png|gif|webp|tiff|svg|avif)$/i        
};

/**
 * Main function to process all files in the target directory
 */
async function processImages() {
  try {
    // 1. Verify target directory exists
    if (!fs.existsSync(CONFIG.targetDir)) {
      console.log(`📁 Target directory not found. Creating: ${CONFIG.targetDir}`);
      fs.mkdirSync(CONFIG.targetDir, { recursive: true });
      console.log(`💡 Please place the images you want to process in the 'target-images' folder and run again.`);
      return;
    }

    // 2. Get all supported image files in target directory
    const files = fs.readdirSync(CONFIG.targetDir);
    
    // Filter out directories and unsupported files
    const imageFiles = files.filter(file => {
      const isFile = fs.statSync(path.join(CONFIG.targetDir, file)).isFile();
      const isSupported = CONFIG.supportedExtensions.test(file);
      return isFile && isSupported;
    });

    if (imageFiles.length === 0) {
      console.log(`⚠️ No supported images found in ${CONFIG.targetDir}.`);
      return;
    }

    const actionText = CONFIG.targetFormat ? 'rename and convert' : 'rename';
    console.log(`🔍 Found ${imageFiles.length} images to ${actionText}. Starting process...\n`);

    // 3. Process each image sequentially
    let currentNumber = CONFIG.startNumber;
    let successCount = 0;
    let errorCount = 0;

    for (const file of imageFiles) {
      const oldPath = path.join(CONFIG.targetDir, file);
      
      // Determine the final extension based on configuration
      let finalExtension = path.extname(file).toLowerCase();
      if (CONFIG.targetFormat) {
        // Ensure extension has a leading dot and handles 'jpeg' vs 'jpg' common cases
        finalExtension = CONFIG.targetFormat.startsWith('.') ? CONFIG.targetFormat : `.${CONFIG.targetFormat}`;
      }
      
      // We use a temporary UUID in the filename to avoid collisions 
      // where we might overwrite an existing file that hasn't been processed yet
      const tempId = Math.random().toString(36).substr(2, 9);
      const finalName = `${CONFIG.prefix}-${currentNumber}${finalExtension}`;
      const tempFinalPath = path.join(CONFIG.targetDir, `temp-${tempId}-${finalName}`);
      const finalPath = path.join(CONFIG.targetDir, finalName);

      try {
        if (CONFIG.targetFormat) {
          // CONVERSION + RENAMING MODE
          // Convert using sharp and save to temporary final path
          let formatName = CONFIG.targetFormat.replace('.', '').toLowerCase();
          if (formatName === 'jpg') formatName = 'jpeg'; // Sharp uses 'jpeg'

          await sharp(oldPath)
            .toFormat(formatName, { quality: CONFIG.quality })
            .toFile(tempFinalPath);
          
          // Delete the original file since we created a new converted one
          fs.unlinkSync(oldPath);
          
          // Rename temp file to final destination
          fs.renameSync(tempFinalPath, finalPath);
          
        } else {
          // RENAMING ONLY MODE (Preserves original file)
          // First rename to temp path to avoid overwriting conflicts during loop
          const tempPath = path.join(CONFIG.targetDir, `temp-${tempId}${finalExtension}`);
          fs.renameSync(oldPath, tempPath);
          
          // Then rename to final path
          fs.renameSync(tempPath, finalPath);
        }

        const actionTaken = CONFIG.targetFormat ? 'Converted & Renamed' : 'Renamed';
        console.log(`✅ ${actionTaken}: ${file} → ${finalName}`);
        successCount++;
        
      } catch (err) {
        console.error(`❌ Error processing ${file}:`, err.message);
        
        // Clean up temp files if error occurred during conversion/renaming
        if (fs.existsSync(tempFinalPath)) fs.unlinkSync(tempFinalPath);
        errorCount++;
      }

      currentNumber++;
    }

    // 4. Print a final summary
    console.log(`\n🎉 Processing complete!`);
    console.log(`📊 Summary: ${successCount} successful, ${errorCount} failed.`);

  } catch (error) {
    console.error('❌ An unexpected error occurred:', error);
  }
}

// Execute the script
processImages();
