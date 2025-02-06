import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process', 'http', 'https', 'stream', 'util', 'url', 'events', 'assert', 'crypto'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    global: 'globalThis',
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['mersenne-twister']
        }
      }
    }
  },
  resolve: {
    alias: {
      'http': 'vite-plugin-node-polyfills/polyfills/http',
      'https': 'vite-plugin-node-polyfills/polyfills/http',
      'stream': 'vite-plugin-node-polyfills/polyfills/stream',
      'url': 'vite-plugin-node-polyfills/polyfills/url',
      'events': 'vite-plugin-node-polyfills/polyfills/events',
      'assert': 'vite-plugin-node-polyfills/polyfills/assert',
      'crypto': 'vite-plugin-node-polyfills/polyfills/crypto',
    },
  },
  base: process.env.BASE_PATH || '/',
});