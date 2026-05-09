import { createApp } from 'vue'
import { createPinia } from 'pinia'
import CjxLowCode, { $XDialog } from 'cjx-low-code'
import Particles from '@tsparticles/vue3'
import { loadSlim } from '@tsparticles/slim' // 引入slim版本引擎
import App from './App.vue'
import router from './router/index'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'

// 引入状态管理
import { setupStore } from '@/store'

import XColorPicker from '@/components/color-picker'

import 'virtual:uno.css'
import 'element-plus/dist/index.css'
import 'cjx-low-code/dist/index.css'

const setupAll = async () => {
  const app = createApp(App)

  app.use(Particles, {
    init: async (engine) => {
      // await loadFull(engine); // you can load the full tsParticles library from "tsparticles" if you need it
      await loadSlim(engine) // or you can load the slim version from "tsparticles-slim" if don't need Shapes or Animations
    }
  })

  app.use(CjxLowCode)

  app.config.globalProperties.$Dialog = $XDialog(app._context)
  app.component('XColorPicker', XColorPicker)

  setupI18n(app)

  setupStore(app)

  app.use(createPinia())

  app.use(router)

  app.mount('#app')
}

setupAll()
