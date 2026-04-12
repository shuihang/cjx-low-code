import { provideGlobalConfig } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { provideGlobalConfig as xProvideGlobalConfig } from './components/config-provider'
import { version } from './version'

import type { App, Plugin } from 'vue'
import type { ConfigProviderContext } from 'element-plus'
import type { ConfigProviderContext as XConfigProviderContext } from './components/config-provider'
// import { $XDialog } from '@cjx-low-code/components/index'

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (
    app: App,
    options?: {
      cjxLocale?: XConfigProviderContext['locale']
    } & ConfigProviderContext
  ) => {
    components.forEach((component) => {
      app.use(component)
    })
    // app.config.globalProperties.$XDialog = $XDialog(app._context);
    if (options) {
      //console.log('options xProvideGlobalConfig', options)
      const elOptions = { ...options, locale: options.locale || zhCn } as ConfigProviderContext
      provideGlobalConfig(elOptions, app, true)
      xProvideGlobalConfig({ locale: options.cjxLocale }, app, true)
    } else {
      provideGlobalConfig({ locale: zhCn }, app, true)
    }
  }

  // 如果存在选项，则调用 provideGlobalConfig 函数
  return {
    version,
    install
  }
}
