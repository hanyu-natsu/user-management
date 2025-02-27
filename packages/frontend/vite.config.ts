import { config } from '@dotenvx/dotenvx';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import tsconfigPaths from 'vite-tsconfig-paths';

config();

// https://vitejs.dev/config/
export default defineConfig({
  cacheDir: '.vite',
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'SOURCEMAP_ERROR') {
          return;
        }
        defaultHandler(warning);
      },
    },
  },
  plugins: [tsconfigPaths(), react(), EnvironmentPlugin({})],
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
  },
});
