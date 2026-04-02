# Dummy Data / JSON Generator

A fast, customizable Node.js script that generates realistic mock JSON data using the powerful `@faker-js/faker` library.

When you're building a frontend application and the backend API isn't ready yet, or when you need to populate a database with test data, this tool can instantly generate hundreds or thousands of highly realistic records (like names, emails, avatars, product prices, dates, etc.).

## ✨ Features
- **Pre-built Schemas:** Comes with three ready-to-use data structures: `users`, `products`, and `posts`.
- **Highly Realistic:** Uses `@faker-js/faker` to generate real-sounding names, realistic UUIDs, actual URLs for images, and logical dates.
- **Easily Extensible:** You can easily add your own custom data schemas by editing the Javascript functions.

## 🚀 Installation

1. Navigate to the `dummy-data-generator` directory:
   ```bash
   cd path/to/dummy-data-generator
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```

## 📖 Usage

1. Open `generate-data.js` in your editor.
2. Edit the `CONFIG` object at the top of the file to choose how many items you want and what schema to use (`'users'`, `'products'`, or `'posts'`).
3. Run the generator:
   ```bash
   npm start
   ```
   *(Alternatively: `node generate-data.js`)*
4. Grab your generated `data.json` from the `output` folder!

## ⚙️ Configuration
You can customize the script by editing the `CONFIG` object at the top of `generate-data.js`:

```javascript
const CONFIG = {
  outputFile: path.join(__dirname, './output/data.json'), // Where to save the data
  count: 50,                                              // Number of items to generate
  schemaType: 'users'                                     // 'users', 'products', or 'posts'
};
```

### Building your own Schema
If the default `users`, `products`, or `posts` aren't what you need, you can easily create your own structure. Just look at the `createUser()` function in `generate-data.js` as an example:

```javascript
function createCustomThing() {
  return {
    id: faker.string.uuid(),
    title: faker.company.name(),
    color: faker.color.human(),
    price: faker.commerce.price()
  };
}
```
Check out the [Faker.js Documentation](https://fakerjs.dev/api/) for hundreds of different types of data you can generate (like credit cards, IP addresses, animal names, etc.).