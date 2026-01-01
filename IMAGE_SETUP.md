# Image Assets Setup

The Figma MCP asset URLs are not publicly accessible and will return 404 errors. To fix this, you have a few options:

## Option 1: Download Images from Figma (Recommended)

1. Open the Figma design: https://www.figma.com/design/vD4z3ypeUNXNbHFr9tDnId/Pamoja?node-id=925-9
2. Export the images you need:
   - Right-click on each image/sticker
   - Select "Export" or "Copy as PNG/SVG"
   - Save them to the `public/assets/` folder
3. Update the image URLs in `src/components/LaptopStickerStudio.tsx` to point to `/assets/filename.png`

## Option 2: Use Placeholder Images

The app now includes error handling, so it will show placeholder boxes when images fail to load. You can:
- Upload your own stickers using the "Upload your stickers" button
- Replace the placeholder URLs with your own image URLs

## Option 3: Use Figma API (Advanced)

If you have Figma API access, you can programmatically download the assets using the Figma API.

## Current Image Requirements

The app needs these images:
- Main laptop image (imgMainImage)
- 6 sticker images (imgStickerImage through imgStickerImage5)
- Upload icon (img)
- Decorative icons (imgGroup, imgGroup1)



