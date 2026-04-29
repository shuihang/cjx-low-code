import { defineConfig } from 'vitepress'
import { resolve } from 'path'

export default defineConfig({
  title: '@cjx-low-code/element-plus',
  description: 'Vue3 + Element Plus 低代码适配层文档',
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/install' },
      { text: '组件', link: '/components/form' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          collapsed: false,
          items: [
            { text: '安装', link: '/guide/install' },
            { text: '快速开始', link: '/guide/quickstart' }
          ]
        }
      ],
      '/components/': [
        {
          text: '表单容器',
          collapsed: false,
          items: [
            { text: 'Form', link: '/components/form' },
            { text: 'FormItem', link: '/components/form-item' }
          ]
        },
        {
          text: '表单组件',
          collapsed: false,
          items: [
            { text: 'Input', link: '/components/input' },
            { text: 'Select', link: '/components/select' },
            { text: 'Cascader', link: '/components/cascader' },
            { text: 'Radio / RadioGroup', link: '/components/radio' },
            { text: 'Checkbox / CheckboxGroup', link: '/components/checkbox' },
            { text: 'Switch', link: '/components/switch' },
            { text: 'TimePicker', link: '/components/time-picker' },
            { text: 'TimeSelect', link: '/components/time-select' },
            { text: 'Rate', link: '/components/rate' }
          ]
        }
      ]
    },

    outline: {
      level: [2, 3]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/shuihang/cjx-low-code' }
    ],

    footer: {
      message: '基于 MIT 协议发布',
      copyright: 'Copyright © cjx-low-code'
    }
  },

  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, '../examples')
      }
    }
  }
})
