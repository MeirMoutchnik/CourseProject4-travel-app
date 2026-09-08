import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // More reliable on Windows / "My Documents" paths
      usePolling: true,
      interval: 300,
    },
    proxy: {
      // Use /api/* so /trains-bg.png and /flights-bg.png are not stolen
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
