// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { createApp, App } from 'vue' // 如果组件库依赖了某些Vue插件，可能需要createApp
import { AntDesignContainer } from '@vitepress-demo-preview/component'
import '@vitepress-demo-preview/component/dist/style.css'; // 引入预览组件样式
import ElementPlus from 'element-plus' // 引入 Element Plus
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css' // 引入 Element Plus 样式


// import CjxLowCode from '../../../dist/cjx-low-code/dist/index.full.mjs'
import CjxLowCode from 'cjx-low-code'
import { $XDialog } from 'cjx-low-code'
import 'cjx-low-code/dist/index.css'
import './style.css'


export default {
  ...DefaultTheme,
  // 在enhanceApp中注册组件
  enhanceApp({ app }: { app: App }) {
    // 注册整个组件库（如果你的组件库提供了install方法）
    app.use(ElementPlus, { locale: zhCn })

    app.use(CjxLowCode)
    
    // app.component('XCrud', XCrud)

    app.config.globalProperties.$XDialog = $XDialog(app._context)

    // 注册Demo预览插件提供的容器组件
    app.component('demo-preview', AntDesignContainer)
  }
}