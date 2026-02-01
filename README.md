# Image to WebP Converter

A purely frontend web application to convert PNG/JPG images to WebP with quality control and zip download.

## Features
- **Frontend Only**: No backend required.
- **Conversion**: Converts PNG/JPG to WebP with adjustable quality.
- **Bulk Processing**: Upload and convert multiple images.
- **Client-side Zip**: Download all converted images as a .zip file.
- **Fast & Minimal UI**: Built with React and Tailwind CSS.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Deploy**:
   The `dist` folder created by `npm run build` is ready for deployment.
   - **Netlify**: Drag and drop the `dist` folder into your site's deploy area.
   - **Vercel/Static**: Point the output directory to `dist`.

## Technologies
- React + Vite
- Tailwind CSS
- JSZip (Zip generation)
- FileSaver (Download)
- Canvas API (Image Processing)
