/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './config/postcss.config.js',
  },
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/features': '/src/features',
      '@/shared': '/src/shared',
      '@/hooks': '/src/hooks',
      '@/utils': '/src/utils',
      '@/types': '/src/types',
      '@/config': '/src/config',
      '@/constants': '/src/constants',
      '@/data': '/src/data',
      '@/assets': '/src/assets',
      '@/styles': '/src/styles',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          particles: ['react-particles', 'tsparticles-slim'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});
