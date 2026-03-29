# Image Converter & Resizer

A lightweight and fast Node.js tool to convert, optimize, and resize bulk images using the `sharp` library. 

This tool is designed to take a folder of raw images and automatically convert them into modern web-optimized formats (like WebP) while constraining them to a maximum width to save disk space and improve load times.

## ✨ Features
- **Format Conversion:** Easily convert images (JPG, PNG, GIF, TIFF) to modern formats like WebP, AVIF, JPEG, or PNG.
- **Bulk Resizing:** Automatically resize large images to a maximum width while preserving aspect ratios. Smaller images won't be artificially enlarged.
- **Batch Processing:** Process entire directories of images sequentially to avoid memory overload.
- **Highly Configurable:** Easily adjust quality, target format, and maximum width via a simple configuration object.

## 🛠️ Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

## 🚀 Installation

1. Navigate to the `image-converter` directory in your terminal:
   ```bash
   cd path/to/image-converter
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```

## 📖 Usage

1. Create a folder named `original-images` inside the `image-converter` directory (if it doesn't already exist).
2. Place the images you want to convert inside the `original-images` folder.
3. Run the script using npm:
   ```bash
   npm start
   ```
   *(Alternatively, you can run `node image-converter-script-sharp.js`)*
4. Find your optimized images in the automatically created `converted-images` folder.

## ⚙️ Configuration
You can customize the script's behavior by editing the `CONFIG` object at the top of the `image-converter-script-sharp.js` file:

```javascript
const CONFIG = {
  inputDir: path.join(__dirname, './original-images'),   // Source directory
  outputDir: path.join(__dirname, './converted-images'), // Output directory
  format: 'webp',                                        // Target format (e.g., 'webp', 'jpeg', 'png')
  quality: 90,                                           // Output quality (0-100)
  maxWidth: 1920,                                        // Resize width (set to null to disable)
  supportedExtensions: /\.(jpe?g|png|gif|tiff)$/i        // Supported input files
};
```

### Common Configuration Scenarios:
- **No Resizing:** Set `maxWidth: null` to keep the original dimensions of the images.
- **Convert to JPEG:** Set `format: 'jpeg'` if you need maximum compatibility rather than the smallest file sizes.
- **Ultra-low file size:** Set `format: 'avif'` and `quality: 50`.

## ❓ Troubleshooting
- **Input directory not found:** Ensure you have created the `original-images` folder and placed at least one image inside it.
- **No supported images found:** Make sure your images have valid extensions (e.g., `.jpg`, `.png`).
- **Sharp installation errors:** If `sharp` fails to install, try running `npm cache clean --force` and then `npm install` again. Depending on your OS, you may need build tools installed.
