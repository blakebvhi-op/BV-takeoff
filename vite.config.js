import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages serves from /<repo-name>/ — the deploy workflow sets BASE_PATH.
// Locally and on a custom domain it stays "/".
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,               // we ship public/manifest.webmanifest ourselves
      includeAssets: ['icons/*.png', 'sample-eagleview.json'],
      workbox: { globPatterns: ['**/*.{js,css,html,png,json,webmanifest}'] },
    }),
  ],
})
