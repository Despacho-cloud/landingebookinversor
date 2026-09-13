import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Adelanta la descarga de las fuentes.
 *
 * Sin esto el navegador solo descubre los woff2 después de bajar y analizar el
 * CSS, así que empiezan tardísimo y el texto se ve primero con la tipografía
 * de respaldo y luego salta. Con el preload arrancan a la vez que el CSS y
 * llegan antes del primer pintado.
 *
 * Los nombres llevan hash, así que se leen del bundle ya generado.
 */
function precargarFuentes() {
  return {
    name: 'precargar-fuentes',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      const fuentes = Object.keys(ctx.bundle ?? {}).filter((f) => f.endsWith('.woff2'))
      return {
        html,
        tags: fuentes.map((archivo) => ({
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: `./${archivo}`,
            crossorigin: '',
          },
          injectTo: 'head-prepend',
        })),
      }
    },
  }
}

// base './' -> el build funciona tanto en la raíz de un dominio
// como dentro de un subdirectorio (GitHub Pages, /landing, etc.)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), precargarFuentes()],
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
