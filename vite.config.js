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

  server: {
    proxy: {
      // Único proxy: NewsAPI (resuelve CORS en desarrollo)
      // Los feeds RSS se obtienen via allorigins.win directamente desde el
      // browser — sin proxy Vite, sin restart necesario.
      '/newsapi': {
        target:       'https://newsapi.org',
        changeOrigin: true,
        rewrite:      (path) => path.replace(/^\/newsapi/, ''),
      },
    },
  },
})
