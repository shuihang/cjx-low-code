# 快速开始

## 完整引入

如果你对打包体积不敏感，可以直接引入整个适配层：

```ts
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

// 引入 @cjx-low-code/element-plus 导出的组件
import { Form, Input, Select } from '@cjx-low-code/element-plus'

const app = createApp(App)

app.use(ElementPlus)

// 注册需要的组件
app.component('ElFormAdapter', Form)
app.component('ElInputAdapter', Input)
app.component('ElSelectAdapter', Select)

app.mount('#app')
```

## 按需引入

推荐按需引入，配合构建工具的 Tree Shaking：

```vue
<template>
  <Form :model="formModel">
    <FormItem title="用户名" name="username">
      <Input v-model="formModel.username" />
    </FormItem>
    <FormItem title="性别" name="gender">
      <Select v-model="formModel.gender" :options="options" />
    </FormItem>
  </Form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Form, FormItem, Input, Select } from '@cjx-low-code/element-plus'

const formModel = reactive({
  username: '',
  gender: ''
})

const options = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' }
]
</script>
```

## 配合 createSchemaField 使用

如果你更偏好声明式配置，可以结合 `@cjx-low-code/vue` 提供的 `createSchemaField`：

```vue
<template>
  <Form :model="form">
    <SchemaField
      v-for="item in schema"
      :key="item.name"
      v-bind="item"
    />
  </Form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { createSchemaField } from '@cjx-low-code/vue'
import { Form, FormItem, Input, Select, RadioGroup } from '@cjx-low-code/element-plus'

const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    RadioGroup
  }
})

const form = reactive({
  name: '',
  gender: '1'
})

const schema = [
  {
    type: 'Input',
    title: '姓名',
    name: 'name',
    required: true
  },
  {
    type: 'RadioGroup',
    title: '性别',
    name: 'gender',
    enum: [
      { label: '男', value: '1' },
      { label: '女', value: '2' }
    ]
  }
]
</script>
```

> 更多 `createSchemaField` 用法请参考 [@cjx-low-code/vue](https://github.com/shuihang/cjx-low-code/tree/main/packages/vue) 文档。

## 与 cjx-low-code 高层组件的关系

`@cjx-low-code/element-plus` 是底层适配包，主要服务于以下场景：

1. **自定义封装**：你需要对 Element Plus 组件进行二次封装时，可以参考本包的 `connect` 用法。
2. **独立使用**：不使用 `cjx-low-code` 上层业务组件（如 `XForm`、`XCrud`），仅引入核心能力自建表单。
3. **扩展组件**：当 `cjx-low-code` 上层组件未覆盖某些 Element Plus 组件时，可直接使用本包提供的适配组件。
