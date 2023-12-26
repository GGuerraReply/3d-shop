import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1600, }
  /*resolve: {
    alias: [
      { find: 'three', replacement: fileURLToPath(new URL('./node_modules/three', import.meta.url)) },
    ],
  }*/
})