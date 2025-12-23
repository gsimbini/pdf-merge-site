# SimbaPDF - Free PDF Merge Site (Coded)

This is a minimal Next.js project that provides a **free online PDF merge tool**
with placeholders for future tools (compress, split) and monetisation slots.

## Features

- Next.js + React frontend
- `/merge-pdf` page to merge multiple PDFs
- `/api/merge-pdf` API route using `pdf-lib`
- Clean, mobile-friendly UI
- Ad / monetisation placeholders ready for AdSense or other networks

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open http://localhost:3000 in your browser.

## Build for Production

```bash
npm run build
npm start
```

Then deploy to platforms like **Vercel** with one click.

## Notes

- Files are read in the browser and sent as base64 strings to the API.
- The server merges PDFs in memory (no file system storage is used).
- You should later add:
  - Real compression & split logic
  - Cookie / privacy policy pages
  - Your AdSense script in the designated `<div>` placeholders
