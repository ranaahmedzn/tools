# SVG Spritemap Generator

A lightweight Node.js tool to combine dozens of individual `.svg` icon files into a single, optimized `<svg><symbol>` spritemap.

Using a single SVG spritemap drastically improves web performance by reducing the number of HTTP requests required to load icons. Instead of loading 20 different icon files, you load 1 file and reference the icons you need via HTML.

## ✨ Features
- **Auto ID Generation:** Automatically creates `<symbol>` IDs based on the original file name (e.g., `home.svg` becomes `icon-home`).
- **ViewBox Preservation:** Extracts and preserves the `viewBox` from your original SVGs so they scale correctly.
- **Hidden Wrapper:** The generated `sprite.svg` automatically includes `style="display: none;"` so it doesn't mess up your webpage layout when injected.

## 🚀 Installation

1. Navigate to the `svg-spritemap-generator` directory:
   ```bash
   cd path/to/svg-spritemap-generator
   ```
2. Install the required dependencies (`cheerio` for HTML/XML parsing):
   ```bash
   npm install
   ```

## 📖 Usage

1. Place all your individual `.svg` icon files inside the `input-icons` folder.
2. Run the generator:
   ```bash
   npm start
   ```
   *(Alternatively: `node svg-generator.js`)*
3. Grab your generated `sprite.svg` from the `output` folder.

## 💻 How to use the output in your project

**1. Include the sprite in your HTML**
Paste the contents of the `sprite.svg` file right after your opening `<body>` tag in your HTML document.

**2. Use the icons**
Wherever you want an icon to appear, use this simple HTML snippet:
```html
<svg class="my-icon-class" width="24" height="24">
  <use href="#icon-home" />
</svg>
```
*(Replace `icon-home` with the name of your original SVG file, prefixed with `icon-`)*

## ⚙️ Configuration
You can customize the script by editing the `CONFIG` object at the top of `svg-generator.js`:

```javascript
const CONFIG = {
  inputDir: path.join(__dirname, './input-icons'),
  outputFile: path.join(__dirname, './output/sprite.svg'),
  idPrefix: 'icon-',           // Prefix added to all symbol IDs
  defaultViewBox: '0 0 24 24'  // Fallback if an SVG is missing a viewBox
};
```