import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {}, // Prevent process is not defined error
  },
  build: {
    lib: {
      entry: "src/main.tsx",
      name: "Chatbot",
      fileName: "widget", // Base name for output
      formats: ["umd"], // Browser-compatible UMD format
    },
    rollupOptions: {
      external: ["react", "react-dom"], // Externalize React and ReactDOM
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        entryFileNames: "widget.js", // Explicitly set output filename
      },
    },
    outDir: "dist",
    emptyOutDir: true, // Clear dist folder on build
    minify: "esbuild", // Minify for smaller bundle
    sourcemap: false, // Disable sourcemaps for production
  },
});
