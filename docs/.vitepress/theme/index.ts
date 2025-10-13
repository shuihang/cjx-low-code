// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { createApp, App } from 'vue' // 如果组件库依赖了某些Vue插件，可能需要createApp
import { AntDesignContainer } from '@vitepress-demo-preview/component'
import '@vitepress-demo-preview/component/dist/style.css'; // 引入预览组件样式
import ElementPlus from 'element-plus' // 引入 Element Plus
// import { ElPopover } from 'element-plus'
import Popover from '../../components/popover.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import elEn from 'element-plus/es/locale/lang/en'
import 'element-plus/dist/index.css' // 引入 Element Plus 样式


import CjxLowCode from '../../../dist/cjx-low-code/dist/index.full.mjs'
import en from '../../../dist/cjx-low-code/dist/locale/en'
// import CjxLowCode from 'cjx-low-code'
// import CjxLowCode from '@cjx-low-code/components'
import { XCrud, XForm, XEditTable , $XDialog } from '@cjx-low-code/components'
import 'cjx-low-code/dist/index.css'
import './style.css'


export default {
  ...DefaultTheme,
  // 在enhanceApp中注册组件
  enhanceApp({ app }: { app: App }) {
    // 注册整个组件库（如果你的组件库提供了install方法）
    app.use(ElementPlus, { locale: zhCn })
    app.component('popover', Popover)

    app.use(CjxLowCode, { cjxLocale: en, locale: elEn })
    
    // app.component('XCrud', XCrud)
    // app.component('XForm', XForm)
    // app.component('XEditTable', XEditTable)


    app.config.globalProperties.$XDialog = $XDialog(app._context)

    // 注册Demo预览插件提供的容器组件
    app.component('demo-preview', AntDesignContainer)
  }
}