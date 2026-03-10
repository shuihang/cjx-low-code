import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

export default defineConfig({
  plugins: [Vue(), VueJsx({
      babelPlugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }]
      ]
    }),],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'vue'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      jsx: 'automatic',
      jsxImportSource: 'vue'
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
