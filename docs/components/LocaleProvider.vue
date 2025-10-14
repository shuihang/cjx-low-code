<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useData, inBrowser } from 'vitepress'
import { XConfigProvider } from 'cjx-low-code'

// 1. 导入所需的 Element Plus 语言包
// import zhCn from 'element-plus/lib/locale/lang/zh-cn'
// import en from 'element-plus/lib/locale/lang/en'
import zhCn from '../../dist/cjx-low-code/es/locale/lang/zh-cn.mjs'
import en from '../../dist/cjx-low-code/es/locale/lang/en.mjs'

// ... 导入其他支持的语言包

// 2. 获取 Vitepress 的页面数据
const { lang } = useData()
let catchLang = lang.value
const locale = ref()

// 3. 创建语言映射表
const localeMap: Record<string, any> = {
  'zh': zhCn, // 确保这里的键与 Vitepress 配置中的 `lang` 字段匹配
  'en': en,
  // ... 添加其他语言映射
}

// 4. 监听语言变化并更新 Element Plus 的配置
watchEffect(() => {
  if (inBrowser) {
    // 根据 Vitepress 的当前语言，设置对应的 Element Plus 语言包
    console.log('当前语言', lang.value)
    if (catchLang !== lang.value) {
      window.history.go(0);
    }
    catchLang = lang.value
    locale.value = localeMap[lang.value] || zhCn // 默认回退到英文
   
    // window.history.go(0);
  }
})
</script>

<template>
  <!-- 5. 使用 ElConfigProvider 包裹子组件 -->
  <x-config-provider :locale="locale">
    <slot />
  </x-config-provider>
</template>