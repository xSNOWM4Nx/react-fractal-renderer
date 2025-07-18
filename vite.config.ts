import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub repo name
const repoName = 'react-fractal-renderer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000
  },
  base: `/${repoName}/`
})
