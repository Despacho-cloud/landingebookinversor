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
    assetsInlineLimit: 4096, // los archivos diminutos viajan dentro del CSS/JS
    rollupOptions: {
      output: {
        /* React y framer-motion cambian poco: en su propio archivo, el
           navegador los reutiliza de la caché entre despliegues y solo
           vuelve a bajar el código del sitio. */
        manualChunks: {
          react: ['react', 'react-dom'],
          animacion: ['framer-motion'],
        },
      },
    },
  },
})
