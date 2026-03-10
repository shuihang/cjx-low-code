import 'reflect-metadata'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@cjx-low-code/theme-chalk/src/index.scss'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
