import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' -> el build funciona tanto en la raíz de un dominio
// como dentro de un subdirectorio (GitHub Pages, /landing, etc.)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
})
