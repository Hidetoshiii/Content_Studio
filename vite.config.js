import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Alias de rutas — importa desde @/ en lugar de ../../../
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Los proxies de NewsAPI y NewsData.io se eliminaron.
  // Las llamadas externas ahora van a través de las Vercel API Routes (/api/*),
  // que en desarrollo local se sirven con `vercel dev`.
})
