# Image Assets Setup

## Asset Policy

**IMPORTANT:** Do not use direct Figma asset URLs (e.g., `https://www.figma.com/api/mcp/asset/...`) in the code. These URLs are temporary and will expire, causing images to break in production.

## How to Add New Images

1.  **Download from Figma**: Export the image as PNG (or SVG for icons) from the Figma design.
2.  **Save Locally**: Save the file to the `public/assets/` directory in this project.
3.  **Reference Locally**: In your code, reference the image using the absolute path from the public root, e.g., `/assets/my-image.png`.

## Validation

The project includes an ESLint rule that will fail the build if any Figma API asset URLs are detected in the code.

```bash
npm run lint
```

## Troubleshooting

If you see an error like "Do not use temporary Figma asset URLs", find the offending URL and replace it with a local asset as described above.
