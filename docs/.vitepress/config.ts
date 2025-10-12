import { defineConfig } from 'vitepress'
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'
import VueJsx from '@vitejs/plugin-vue-jsx'
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { resolve } from 'path';
// import CustomSidebar from './plugins/CustomSidebar.vue'

const attributeArray = [
  '/zh-cn/attribute/',
  '/zh-cn/components/'
]

const alias = {
  '@': resolve(__dirname, '../../example'),
};

const getSidebar = () => {
  const sidebar = {}
  attributeArray.forEach(key => {
    sidebar[key] = [
      {
        text: '属性配置',
        collapsed: true,
        items: [
          { text: 'Crud', link: '/zh-cn/attribute/crud.md' },
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
    ]
  })

  return sidebar
}


export default defineConfig({
  title: "cjx-low-code",
  description: "低代码",
  
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/zh-cn/guide/basic/install.md' },
      { text: '组件', link: '/zh-cn/attribute/crud.md' }
    ],
    sidebar: {
      '/zh-cn/guide/': [
         {
          text: '基础',
          collapsed: true,
          items: [
            { text: '安装', link: '/zh-cn/guide/basic/install.md' },
            { text: '快速开始', link: '/zh-cn/guide/basic/start.md' },
          ]
        },
        {
          text: '进阶',
          collapsed: true,
          items: [
            { text: '国际化', link: '/zh-cn/guide/advanced/i18n.md' },
            { text: '暗黑模式', link: '/zh-cn/guide/advanced/dark.md' }
          ]
        },
      ],
      ...getSidebar()
    },
    
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
      md.use(containerPreview, { alias })
      md.use(componentPreview, { alias })
    }
  },
  vite: {
    resolve: {
      alias,
    },
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
