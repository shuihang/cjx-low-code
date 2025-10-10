import { provideGlobalConfig } from 'element-plus'
import { version } from './version'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import type { App, Plugin } from 'vue'
import type { ConfigProviderContext } from 'element-plus'
// import { $XDialog } from '@cjx-low-code/components/index'

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options?: ConfigProviderContext) => {
    
    console.log('options', options)

    components.forEach((component) => {
      app.use(component)
    })
    // app.config.globalProperties.$XDialog = $XDialog(app._context);
    if (options) {
      provideGlobalConfig(options, app, true)
    } else {
      console.log('provideGlobalConfig', options)
      provideGlobalConfig({ locale: zhCn }, app, true)
    }
  }

    // 如果存在选项，则调用 provideGlobalConfig 函数
  return {
    version,
    install,
  }
}
