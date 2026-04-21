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
      '@': resolve(__dirname, 'src'),
      '@cjx-low-code/core': resolve(__dirname, '../../packages/core/src'),
      '@cjx-low-code/json-schema': resolve(__dirname, '../../packages/json-schema/src'),
      '@cjx-low-code/antdv': resolve(__dirname, '../../packages/antdv/src'),
      '@cjx-low-code/element-plus': resolve(__dirname, '../../packages/element-plus/src'),
      '@cjx-low-code/reactivity': resolve(__dirname, '../../packages/reactivity/src'),
      '@cjx-low-code/reactivity-vue': resolve(__dirname, '../../packages/reactivity-vue/src'),
      '@cjx-low-code/vue': resolve(__dirname, '../../packages/vue/src')
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