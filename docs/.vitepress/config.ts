import { defineConfig } from 'vitepress'
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "cjx-low-code",
  description: "低代码",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/zh-cn/guide/basic.md' },
      { text: '组件', link: '/zh-cn/attribute/crud.md' }
    ],
    sidebar: [
      {
        text: '属性配置',
        collapsed: true,
        items: [
          { text: 'Crud', link: '/zh-cn/attribute/crud.md#crud' },
          { text: 'Form', link: '/zh-cn/attribute/form.md' },
          { text: 'EditTable', link: '/zh-cn/attribute/editTable.md' },
          { text: '$XDialog', link: '/zh-cn/attribute/dialog.md' },
        ]
      },
      {
        text: '组件',
        collapsed: true,
        items: [
          { text: 'Crud', link: '/zh-cn/components/crud.md' },
          { text: '$XDialog', link: '/zh-cn/components/dialog.md' },
        ]
      },
    ],
    outline: {
      level: [2, 3] // 显示 h2 和 h3 标题
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  markdown: {
    config(md) {
      // 使用 demo 预览插件
      md.use(containerPreview)
      md.use(componentPreview)
    }
  },
  vite: {
    plugins: [
      VueJsx({
        babelPlugins: [
          ["@babel/plugin-proposal-decorators", { legacy: true }],
          ["@babel/plugin-proposal-class-properties", { loose: true }]
        ]
      }) as any
    ],
    
  }
})
