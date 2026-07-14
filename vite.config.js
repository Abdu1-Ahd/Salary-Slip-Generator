import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'
// https://vite.dev/config/
export default defineConfig({
  base: '/Salary-Slip-Generator/',
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler"]
        ],
      },
    }),
    tailwindcss(),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
    viteCompression({ algorithm: 'gzip', ext: '.gz' }),
  ],
  build: {
    chunkSizeWarningLimit: 2000,
  }
})
