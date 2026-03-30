# Bulk Image Renamer

A lightweight and fast Node.js tool to bulk rename images in a specific directory. It takes all supported images in the target folder and renames them sequentially using a specified prefix while automatically preserving their original file extensions.

## ✨ Features
- **Sequential Renaming:** Automatically renames your messy image files (e.g., `IMG_001.jpg` and `Screenshot.png`) to structured names like `client-1.jpg` and `client-2.png`.
- **Optional Format Conversion:** Convert all images to a unified format (like `.webp` or `.jpg`) on the fly while renaming them.
- **Dynamic Extensions:** If conversion is disabled, the script detects the original extension (e.g., `.webp`, `.jpg`, `.png`) and preserves it during renaming.
- **Configurable Settings:** Easily customize the prefix, the starting number, the target format, and the target directory.
- **Conflict Safe:** The script prevents overwriting issues (e.g. if `client-1.webp` already exists and another file needs to be renamed to it) by internally using temporary randomized names.

## 🚀 Installation

1. Navigate to the `image-renamer` directory in your terminal:
   ```bash
   cd path/to/image-renamer
   ```
2. Install the required dependencies (`sharp` for optional image conversion):
   ```bash
   npm install
   ```

## 📖 Usage

1. Create a folder named `target-images` inside the `image-renamer` directory.
2. Place all the images you want to rename inside the `target-images` folder.
3. Open `image-renamer.js` and modify the `CONFIG` object if you want a custom prefix (default is `client`).
4. Run the script:
   ```bash
   npm start
   ```
   *(Alternatively, you can run `node image-renamer.js`)*
5. Check your `target-images` folder to see all files perfectly renamed!

## ⚙️ Configuration
You can customize the script's behavior by editing the `CONFIG` object at the top of the `image-renamer.js` file:

```javascript
const CONFIG = {
  targetDir: path.join(__dirname, './target-images'), // Directory containing images to rename
  prefix: 'project',                                  // Prefix for the new file names
  startNumber: 1,                                     // Starting number for the sequence
  targetFormat: 'webp',                               // Set format (e.g., 'webp', 'jpg') or null to keep original
  quality: 90,                                        // Output quality if targetFormat is used
  supportedExtensions: /\.(jpe?g|png|gif|webp|tiff|svg|avif)$/i // Supported file extensions
};
```
