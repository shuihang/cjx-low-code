# Input

基于 `ElInput` 封装，桥接 `v-model` 与低代码字段值系统。

## 引入

```ts
import { Input } from '@cjx-low-code/element-plus'
```

## 属性映射

| 低代码字段 | Element Plus 属性 | 说明 |
|-----------|------------------|------|
| `value` | `modelValue` | 输入框绑定值 |

事件映射：`change` → `update:modelValue`

## 基础用法

```vue
<template>
  <Form :model="form">
    <FormItem title="用户名" name="username">
      <Input v-model="form.username" placeholder="请输入用户名" clearable />
    </FormItem>
    <FormItem title="备注" name="remark">
      <Input v-model="form.remark" type="textarea" :rows="3" />
    </FormItem>
  </Form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Form, FormItem, Input } from '@cjx-low-code/element-plus'

const form = reactive({
  username: '',
  remark: ''
})
</script>
```

## 配合 SchemaField

```ts
const schema = [
  {
    type: 'Input',
    title: '用户名',
    name: 'username',
    x-component-props: {
      placeholder: '请输入',
      clearable: true
    }
  },
  {
    type: 'Input',
    title: '备注',
    name: 'remark',
    x-component-props: {
      type: 'textarea',
      rows: 3
    }
  }
]
```

## API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue / v-model | 绑定值 | `string` | — |
| type | 类型 | `'text' \| 'textarea' \| ...` | `'text'` |
| placeholder | 占位文本 | `string` | — |
| clearable | 是否可清空 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| readonly | 是否只读 | `boolean` | `false` |

> 完整 API 请参考 [Element Plus Input](https://element-plus.org/zh-CN/component/input.html)。
