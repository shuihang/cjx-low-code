## $XDialog

### 简介

`$XDialog` 是一个全局的对话框组件，用于在页面中弹出对话框，支持自定义内容和样式。

### 注册方法

```ts
import { createApp , type App } from 'vue'
import { $XDialog } from 'cjx-low-code'
const app: App = createApp()
app.config.globalProperties.$XDialog = $XDialog(app._context)
```

### 基础用法

<preview path="../../examples/dialog/basic/index.vue" class="vp-raw" :source="false" />

#### demo.vue 代码

:::preview

demo-preview=../../examples/dialog/basic/demo.vue

:::
