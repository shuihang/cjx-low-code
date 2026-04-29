# Form

基于 `ElForm` 封装，通过 `connectFormModel` 桥接低代码表单模型，支持响应式字段校验与生命周期管理。

## 引入

```ts
import { Form } from '@cjx-low-code/element-plus'
```

## 基础用法

直接使用适配后的 `Form` 组件，用法与 `ElForm` 基本一致，额外支持低代码模型注入：

```vue
<template>
  <Form ref="formRef" :model="form" label-width="80px">
    <FormItem title="用户名" name="username">
      <Input v-model="form.username" />
    </FormItem>
    <FormItem title="邮箱" name="email">
      <Input v-model="form.email" />
    </FormItem>
  </Form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Form, FormItem, Input } from '@cjx-low-code/element-plus'

const form = reactive({
  username: '',
  email: ''
})

const formRef = ref<InstanceType<typeof Form>>()
</script>
```

## 配合 useForm 使用

结合 `@cjx-low-code/vue` 的 `useForm` 或 `FormProvider`，可以接入完整的低代码表单能力：

```vue
<template>
  <FormProvider :form="form">
    <Form :model="formModel">
      <SchemaField
        v-for="field in schema"
        :key="field.name"
        v-bind="field"
      />
    </Form>
  </FormProvider>
</template>

<script setup lang="ts">
import { createSchemaField, FormProvider, useForm } from '@cjx-low-code/vue'
import { Form, FormItem, Input, Select } from '@cjx-low-code/element-plus'

const { SchemaField } = createSchemaField({
  components: { FormItem, Input, Select }
})

const form = useForm()
const formModel = form.values

const schema = [
  { type: 'Input', title: '名称', name: 'name' },
  { type: 'Select', title: '类型', name: 'type' }
]
</script>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model | 表单数据对象 | `Record<string, any>` | — |
| rules | 表单验证规则 | `FormRules` | — |
| label-position | 表单域标签的位置 | `'left' \| 'right' \| 'top'` | `'right'` |
| label-width | 表单域标签的宽度 | `string \| number` | — |
| validate-on-rule-change | 是否在 rules 属性改变后立即触发一次验证 | `boolean` | `true` |

> 其余属性与事件与 [Element Plus Form](https://element-plus.org/zh-CN/component/form.html) 完全一致。

## 方法

通过 `ref` 可以调用 `ElForm` 的所有原生方法：

| 方法名 | 说明 |
|--------|------|
| validate | 对整个表单进行校验 |
| validateField | 对部分表单字段进行校验 |
| resetFields | 重置所有字段 |
| clearValidate | 移除表单项的校验结果 |
| scrollToField | 滚动到指定表单字段 |
