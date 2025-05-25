import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from 'fs';

// Custom plugin to clean up the dist directory
function cleanDistPlugin(): Plugin {
  return {
    name: 'vite-plugin-clean-dist',
    enforce: 'pre',
    buildStart() {
      // Only keep the specified files and delete everything else
      try {
        if (fs.existsSync('dist')) {
          const filesToKeep = ['test.html'];
          const files = fs.readdirSync('dist');
          
          files.forEach((file) => {
            if (!filesToKeep.includes(file)) {
              const filePath = resolve('dist', file);
              if (fs.lstatSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
                console.log(`Deleted ${filePath}`);
              }
            }
          });
        }
      } catch (error) {
        console.error('Error cleaning dist directory:', error);
      }
    },
  };
}

// Custom plugin to inline CSS into JS
function inlineCssPlugin(): Plugin {
  return {
    name: 'vite-plugin-inline-css',
    enforce: 'post',
    generateBundle(_, bundle) {
      // Find the CSS file
      const cssFileName = Object.keys(bundle).find(file => file.endsWith('.css'));
      const jsFileName = Object.keys(bundle).find(file => file.endsWith('.cjs') || file.endsWith('.js'));
      
      if (cssFileName && jsFileName && bundle[cssFileName] && bundle[jsFileName]) {
        const cssFile = bundle[cssFileName];
        const jsFile = bundle[jsFileName];
        
        if ('source' in cssFile && 'code' in jsFile) {
          // Get CSS content
          const cssContent = cssFile.source;
          
          // Directly embed CSS in the JS code
          const injectCssCode = `
// CSS bundled directly in JS
var CSS_CONTENT = ${JSON.stringify(cssContent)};
`;
          
          // Add the CSS content at the beginning of the JS file
          jsFile.code = injectCssCode + jsFile.code;
          
          // Remove the CSS file from the bundle
          delete bundle[cssFileName];
          
          console.log('CSS bundled into JS successfully');
        }
      }
    }
  };
}

// Custom plugin to safely handle process references
function processPolyfillPlugin(): Plugin {
  return {
    name: 'vite-plugin-process-polyfill',
    enforce: 'post',
    generateBundle(_, bundle) {
      // Find the JS file
      const jsFileName = Object.keys(bundle).find(file => file.endsWith('.cjs') || file.endsWith('.js'));
      
      if (jsFileName && bundle[jsFileName] && 'code' in bundle[jsFileName]) {
        const jsFile = bundle[jsFileName];
        
        // Add a process polyfill at the beginning of the file
        const processPolyfill = `
// Process polyfill for browser environment
if (typeof window !== 'undefined' && typeof process === 'undefined') {
  window.process = {
    env: {
      NODE_ENV: 'production'
    }
  };
}
`;
        
        jsFile.code = processPolyfill + jsFile.code;
      }
    }
  };
}

export default defineConfig({
  plugins: [
    cleanDistPlugin(), // Clean dist directory
    react(),
    inlineCssPlugin(), // Add our custom plugin
    processPolyfillPlugin() // Add process polyfill plugin
  ],
  build: {
    lib: {
      entry: resolve('src/main.tsx'),
      name: 'ChatbotWidget',
      fileName: 'chatbot-widget',
      formats: ['umd'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        inlineDynamicImports: true,
      },
    },
    outDir: "dist",
    emptyOutDir: false, // Don't empty out dir to keep test.html
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: true,
      },
    },
    cssCodeSplit: false, // Prevent CSS code splitting
    cssMinify: true,
    sourcemap: false,
  },
  define: {
    // Fix "process is not defined" error
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': JSON.stringify({}),
    'process': JSON.stringify({
      env: {
        NODE_ENV: 'production'
      }
    })
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
});
