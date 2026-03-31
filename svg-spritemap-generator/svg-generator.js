/**
 * SVG Spritemap Generator
 * 
 * This script reads all individual .svg files from an input directory,
 * extracts their paths/shapes, and combines them into a single 
 * <svg><symbol> spritemap file for optimized web usage.
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// --- Configuration ---
const CONFIG = {
  // Directory containing individual SVG files
  inputDir: path.join(__dirname, './input-icons'),
  
  // Output file path
  outputFile: path.join(__dirname, './output/sprite.svg'),
  
  // Prefix to add to each symbol ID (e.g., if prefix is 'icon-', a file named 'home.svg' becomes id="icon-home")
  idPrefix: 'icon-',
  
  // Default viewBox if the original SVG doesn't have one
  defaultViewBox: '0 0 24 24'
};

async function generateSprite() {
  try {
    // 1. Check directories
    if (!fs.existsSync(CONFIG.inputDir)) {
      console.log(`📁 Input directory not found. Creating: ${CONFIG.inputDir}`);
      fs.mkdirSync(CONFIG.inputDir, { recursive: true });
      console.log(`💡 Please place your .svg files in the 'input-icons' folder and run again.`);
      return;
    }

    const outputDir = path.dirname(CONFIG.outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 2. Get SVG files
    const files = fs.readdirSync(CONFIG.inputDir).filter(file => file.toLowerCase().endsWith('.svg'));

    if (files.length === 0) {
      console.log(`⚠️ No SVG files found in ${CONFIG.inputDir}.`);
      return;
    }

    console.log(`🔍 Found ${files.length} SVG files. Generating spritemap...\n`);

    // 3. Initialize the master SVG wrapper
    const spriteSvg = cheerio.load(
      '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"></svg>',
      { xmlMode: true }
    );
    const $rootSvg = spriteSvg('svg');

    let successCount = 0;
    let errorCount = 0;

    // 4. Process each SVG
    for (const file of files) {
      try {
        const filePath = path.join(CONFIG.inputDir, file);
        const svgContent = fs.readFileSync(filePath, 'utf-8');
        
        // Load the individual SVG
        const $icon = cheerio.load(svgContent, { xmlMode: true });
        const $svg = $icon('svg');

        if ($svg.length === 0) {
          throw new Error('No <svg> tag found in file.');
        }

        // Get or set viewBox
        const viewBox = $svg.attr('viewbox') || $svg.attr('viewBox') || CONFIG.defaultViewBox;
        
        // Create base filename without extension for the ID
        const basename = path.basename(file, '.svg');
        const symbolId = `${CONFIG.idPrefix}${basename}`;

        // Create the <symbol> wrapper
        const symbol = cheerio.load(`<symbol id="${symbolId}" viewBox="${viewBox}"></symbol>`, { xmlMode: true })('symbol');

        // Copy inner contents of the original SVG into the symbol
        symbol.append($svg.html());

        // Append the symbol to our master SVG
        $rootSvg.append(symbol);
        
        console.log(`✅ Added: ${file} → <symbol id="${symbolId}">`);
        successCount++;
      } catch (err) {
        console.error(`❌ Error processing ${file}:`, err.message);
        errorCount++;
      }
    }

    // 5. Save the output
    if (successCount > 0) {
      fs.writeFileSync(CONFIG.outputFile, spriteSvg.xml());
      console.log(`\n🎉 Spritemap generated successfully!`);
      console.log(`📊 Summary: ${successCount} icons added, ${errorCount} failed.`);
      console.log(`📂 Output saved to: ${CONFIG.outputFile}`);
      
      // Print an example usage
      if (files.length > 0) {
        const sampleId = `${CONFIG.idPrefix}${path.basename(files[0], '.svg')}`;
        console.log(`\n💡 HTML Usage Example:`);
        console.log(`   <svg width="24" height="24">`);
        console.log(`     <use href="sprite.svg#${sampleId}" />`);
        console.log(`   </svg>`);
      }
    }

  } catch (error) {
    console.error('❌ An unexpected error occurred:', error);
  }
}

// Execute
generateSprite();