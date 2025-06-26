import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/etrades/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // increase if you want to silence warning
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';  // bundles all dependencies separately
          }
        }
      }
    }
  }
});
