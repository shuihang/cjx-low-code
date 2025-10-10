# CJX Low Code 组件库使用说明

## 安装

因为 Cjx Low Code 依赖于 Element Plus，所以你需要先安装它。

```bash
nmp install element-plus
npm install cjx-low-code
# 或
yarn add element-plus
yarn add cjx-low-code
# 或
pnpm add element-plus
pnpm add cjx-low-code
```

## 快速开始

本节将介绍如何在项目中使用 Cjx Low Code。

### 用法

### 完整引入

### 如果你对打包后的文件大小不是很在乎，那么使用完整导入会更方便。

```ts
import { createApp } from 'vue'
import CjxLowCode  from 'cjx-low-code'
import 'cjx-low-code/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(CjxLowCode)
app.mount('#app')

```

## Volar 支持

如果您使用 Volar，请在 tsconfig.json 中通过 compilerOptions.type 指定全局组件类型。

```json tsconfig.json
{
  "compilerOptions": {
    "types": ["cjx-low-code/global.d.ts"]
  }
}
```

## 按需引入

如果你只使用部分组件，那么你可以按需引入组件。
```ts
import { createApp } from 'vue'
import { XCrud, XForm } from 'cjx-low-code'
import 'cjx-low-code/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(XCrud)
app.use(XForm)
app.mount('#app')
```

## 手动导入

```vue
<template>
  <x-crud>Cjx Low Code</x-crud>
</template>

<script lang="ts" setup>
import { XCrud } from 'cjx-low-code'

</script>
```
