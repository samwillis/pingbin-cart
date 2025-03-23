import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_APP_BASE_PATH || '/',
  // Ensure the build creates the correct asset paths for GitHub Pages
  build: {
    assetsDir: 'assets',
    outDir: 'dist',
    emptyOutDir: true,
  }
})
