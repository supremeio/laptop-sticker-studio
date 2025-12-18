# Laptop Sticker Studio

A web-based digital customization tool that allows users to virtually decorate their laptop with stickers before committing to real-world application. Think of it as a "try before you buy" playground for laptop personalization.

## Features

- 🎨 **Pixel-perfect design** - Built to match the Figma design exactly
- 🖱️ **Drag and drop** - Easily move stickers around the laptop
- 🔄 **Resize and rotate** - Adjust sticker size and rotation with interactive handles
- 📤 **Upload custom stickers** - Add your own sticker images (PNG, JPG, SVG)
- 💾 **Download your design** - Export your customized laptop as a PNG image
- 💻 **Multiple laptop types** - Switch between Macbook and other laptop models (coming soon)
- 🎯 **Interactive experience** - Real-time preview of your customized laptop

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **react-moveable** - Drag, resize, and rotate functionality
- **html-to-image** - Export designs as images

## Usage

1. **View stickers**: The default stickers are displayed on and around the laptop
2. **Select stickers**: Click on any sticker to select it
3. **Drag stickers**: Click and drag any sticker to reposition it
4. **Resize stickers**: Use the corner handles to resize selected stickers
5. **Rotate stickers**: Use the rotation handle at the top to rotate selected stickers
6. **Upload stickers**: Click the "Upload your stickers" button to add your own images (PNG, JPG, SVG)
7. **Download design**: Click "Download your design" to export your customized laptop as a PNG
8. **Switch tabs**: Use the Macbook/Others tabs to switch between laptop types (coming soon)

## Project Structure

```
├── src/
│   ├── components/
│   │   └── LaptopStickerStudio.tsx  # Main component
│   ├── App.tsx                      # App entry point
│   ├── main.tsx                     # React DOM render
│   └── index.css                    # Global styles
├── index.html                       # HTML template
└── package.json                     # Dependencies
```

## License

MIT

