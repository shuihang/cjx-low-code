import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  rules: [
    // 自定义规则
  ],
  shortcuts: {
    // 自定义快捷方式
  }
})
