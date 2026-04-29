# FormItem

基于 `ElFormItem` 封装，映射低代码字段语义到 Element Plus 的表单项属性。

## 引入

```ts
import { FormItem } from '@cjx-low-code/element-plus'
```

## 属性映射

| 低代码语义 | Element Plus 属性 | 说明 |
|-----------|------------------|------|
| `title` | `label` | 表单域标签文本 |
| `name` | `prop` | 表单域字段名 |

这意味着在 `SchemaField` 或低代码配置中写 `title` 和 `name`，组件内部会自动映射为 `label` 和 `prop`。

## 基础用法

```vue
<template>
  <Form :model="form">
    <FormItem title="用户名" name="username" :rules="[{ required: true }]">
      <Input v-model="form.username" />
    </FormItem>
    <FormItem title="手机号" name="phone">
      <Input v-model="form.phone" />
    </FormItem>
  </Form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Form, FormItem, Input } from '@cjx-low-code/element-plus'

const form = reactive({
  username: '',
  phone: ''
})
</script>
```

## SchemaField 中使用

```ts
const schema = [
  {
    type: 'Input',
    title: '用户名',   // 映射为 label
    name: 'username',  // 映射为 prop
    required: true
  }
]
```

## API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标签文本（映射为 label） | `string` | — |
| name | 字段名（映射为 prop） | `string` | — |
| rules | 验证规则 | `FormItemRule[]` | — |
| required | 是否必填 | `boolean` | `false` |

> 其余属性与 [Element Plus FormItem](https://element-plus.org/zh-CN/component/form.html#form-item-attributes) 完全一致。
