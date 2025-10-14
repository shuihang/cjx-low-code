import { defineConfig } from 'vitepress'
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'
import VueJsx from '@vitejs/plugin-vue-jsx'
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { resolve } from 'path';
import { getSidebar } from './locale'
// import CustomSidebar from './plugins/CustomSidebar.vue'

const alias = {
  '@': resolve(__dirname, '../../example'),
};


export default defineConfig({
  title: "cjx-low-code",
  description: "低代码",
  
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  locales: {
    root: { label: '中文', lang: 'zh', link: '/zh-cn/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh-cn/' },
          { text: '指南', link: '/zh-cn/guide/basic/install.md' },
          { text: '组件', link: '/zh-cn/attribute/crud.md' }
        ],
      }
     },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/basic/install.md' },
          { text: 'Component', link: '/en/attribute/crud.md' }
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Basis',
              collapsed: true,
              items: [
                { text: 'Install', link: '/en/guide/basic/install.md' },
                { text: 'Quick Start', link: '/en/guide/basic/start.md' },
              ],
            },
            {
              text: 'Advanced',
              collapsed: true,
              items: [
                { text: 'I18n', link: '/en/guide/advanced/i18n.md' },
                { text: 'Dark Mode', link: '/en/guide/advanced/dark.md' }
              ]
            },
          ],
          ...getSidebar('en')
        }
      }
    },
    'zh-cn': {
      label: '中文',
      lang: 'zh',
      link: '/zh-cn/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh-cn/' },
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
        ...getSidebar('zh-cn')
      },
      }
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    // nav: [
    //   { text: '首页', link: '/' },
    //   { text: '指南', link: '/zh-cn/guide/basic/install.md' },
    //   { text: '组件', link: '/zh-cn/attribute/crud.md' }
    // ],
    // sidebar: {
    //   '/zh-cn/guide/': [
    //      {
    //       text: '基础',
    //       collapsed: true,
    //       items: [
    //         { text: '安装', link: '/zh-cn/guide/basic/install.md' },
    //         { text: '快速开始', link: '/zh-cn/guide/basic/start.md' },
    //       ]
    //     },
    //     {
    //       text: '进阶',
    //       collapsed: true,
    //       items: [
    //         { text: '国际化', link: '/zh-cn/guide/advanced/i18n.md' },
    //         { text: '暗黑模式', link: '/zh-cn/guide/advanced/dark.md' }
    //       ]
    //     },
    //   ],
    //   ...getSidebar('zh-cn')
    // },
    outline: {
      level: [2, 3] // 显示 h2 和 h3 标题 
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shuihang/cjx-low-code' }
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
    // resolve: {
    //   alias,
    // },
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
