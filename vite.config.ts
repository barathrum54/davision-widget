import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {}, // Prevent process is not defined error
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'ChatbotWidget',
      fileName: 'chatbot-widget',
      formats: ['umd'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    outDir: "dist",
    emptyOutDir: true, // Clear dist folder on build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    sourcemap: false, // Disable sourcemaps for production
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
