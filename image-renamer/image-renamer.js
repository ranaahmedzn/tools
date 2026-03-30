/**
 * Bulk Image Renamer
 * 
 * This script renames all images in a target directory sequentially 
 * based on a provided prefix, preserving their original file extensions.
 */

const fs = require('fs');
const path = require('path');

// --- Configuration ---
// Adjust these settings to customize the renaming process
const CONFIG = {
  // Directory containing images to rename
  targetDir: path.join(__dirname, './target-images'),   
  
  // Prefix for the new file names
  prefix: 'project',                                     
  
  // Starting number for the sequence
  startNumber: 1,                                       
  
  // Supported input file extensions (case-insensitive)
  supportedExtensions: /\.(jpe?g|png|gif|webp|tiff|svg|avif)$/i        
};

/**
 * Main function to process all files in the target directory
 */
function processImages() {
  try {
    // 1. Verify target directory exists
    if (!fs.existsSync(CONFIG.targetDir)) {
      console.log(`📁 Target directory not found. Creating: ${CONFIG.targetDir}`);
      fs.mkdirSync(CONFIG.targetDir, { recursive: true });
      console.log(`💡 Please place the images you want to rename in the 'target-images' folder and run again.`);
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

    console.log(`🔍 Found ${imageFiles.length} images to rename. Starting process...\n`);

    // 3. To avoid naming conflicts (e.g. overwriting client-2.webp if we are renaming to client-2.webp), 
    // we'll rename them to a temporary UUID first, then to their final name.
    const tempRenames = [];
    let currentNumber = CONFIG.startNumber;

    // Phase A: Rename to temp names
    imageFiles.forEach(file => {
      const oldPath = path.join(CONFIG.targetDir, file);
      const extension = path.extname(file).toLowerCase();
      
      const tempName = `temp-${Math.random().toString(36).substr(2, 9)}${extension}`;
      const tempPath = path.join(CONFIG.targetDir, tempName);
      
      const finalName = `${CONFIG.prefix}-${currentNumber}${extension}`;
      const finalPath = path.join(CONFIG.targetDir, finalName);
      
      fs.renameSync(oldPath, tempPath);
      
      tempRenames.push({
        originalName: file,
        tempPath: tempPath,
        finalName: finalName,
        finalPath: finalPath
      });
      
      currentNumber++;
    });

    // Phase B: Rename to final names
    let successCount = 0;
    let errorCount = 0;

    tempRenames.forEach(item => {
      try {
        fs.renameSync(item.tempPath, item.finalPath);
        console.log(`✅ Renamed: ${item.originalName} → ${item.finalName}`);
        successCount++;
      } catch (err) {
        console.error(`❌ Error renaming to ${item.finalName}:`, err.message);
        errorCount++;
      }
    });

    // 4. Print a final summary
    console.log(`\n🎉 Renaming complete!`);
    console.log(`📊 Summary: ${successCount} successful, ${errorCount} failed.`);

  } catch (error) {
    console.error('❌ An unexpected error occurred:', error);
  }
}

// Execute the script
processImages();
