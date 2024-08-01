import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Distribuidas/',
  server: {
    proxy: {
      // Redirige todas las solicitudes a /api a la API HTTP
      '/api': {
        target: 'http://18.221.39.240', // URL de tu API
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
