declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/// <reference types="vite/client" />

interface ImportMeta {
  glob: (pattern: string, options?: { eager?: boolean }) => Record<string, any>
}
