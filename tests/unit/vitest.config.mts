import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import AutoImport from 'unplugin-auto-import/vite'
import legacy from '@vitejs/plugin-legacy'
import { compression } from 'vite-plugin-compression2'



export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    AutoImport({ /* options */ }),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    compression(),
  ],
  test: {
    globals: true, // This is needed by @testing-library to be cleaned up after each test
    include: ['apps/frontend/src/**/*.test.{js,jsx,ts,tsx}'],
    coverage: {
      include: ['apps/frontend/src/**/*'],
      exclude: ['apps/frontend/src/**/*.stories.{js,jsx,ts,tsx}', '**/*.d.ts'],
    },
    environmentMatchGlobs: [
      ['**/*.test.tsx', 'jsdom'],
      ['apps/frontend/src/hooks/**/*.test.ts', 'jsdom'],
    ],
    setupFiles: ['./vitest-setup.ts'],
    env: loadEnv('', process.cwd(), ''),
  },
});