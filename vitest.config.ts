import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue() as any,
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include:  ['packages/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'packages/**/*.d.ts',
        'packages/**/__tests__/**/*',
        'packages/**/test/**/*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'packages')
    }
  }
});
