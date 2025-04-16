import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      timeout: 5000,
      overlay: true
    },
  },
  plugins: [
    react({
      // For React-SWC, don't use fastRefresh property
      // It's internally managed by the plugin
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // This enables compatibility with packages that use process.env
    'process.env': {
      NODE_ENV: JSON.stringify(mode),
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  // Increase build performance and manage memory usage
  build: {
    sourcemap: true, // Enable sourcemaps for debugging
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          charts: ['recharts'],
          motion: ['framer-motion']
        }
      }
    }
  },
  preview: {
    port: 8080,
    host: true,
    cors: true
  }
}));
