# Select

基于 `ElSelect` 封装，桥接 `v-model` 与低代码字段值系统。

## 引入

```ts
import { Select } from '@cjx-low-code/element-plus'
```

## 基础用法

```vue
<template>
  <Form :model="form">
    <FormItem title="城市" name="city">
      <Select v-model="form.city" placeholder="请选择">
        <ElOption label="北京" value="beijing" />
        <ElOption label="上海" value="shanghai" />
        <ElOption label="广州" value="guangzhou" />
      </Select>
    </FormItem>
  </Form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElOption } from 'element-plus'
import { Form, FormItem, Select } from '@cjx-low-code/element-plus'

const form = reactive({
  city: ''
})
</script>
```

## 多选

```vue
<template>
  <Form :model="form">
    <FormItem title="标签" name="tags">
      <Select v-model="form.tags" multiple placeholder="请选择">
        <ElOption label="Vue" value="vue" />
        <ElOption label="React" value="react" />
        <ElOption label="Angular" value="angular" />
      </Select>
    </FormItem>
  </Form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElOption } from 'element-plus'
import { Form, FormItem, Select } from '@cjx-low-code/element-plus'

const form = reactive({
  tags: []
})
</script>
```

## 配合 SchemaField

```ts
const schema = [
  {
    type: 'Select',
    title: '城市',
    name: 'city',
    enum: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' }
    ],
    x-component-props: {
      placeholder: '请选择城市'
    }
  }
]
```

## API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue / v-model | 绑定值 | `string \| string[]` | — |
| multiple | 是否多选 | `boolean` | `false` |
| placeholder | 占位文本 | `string` | — |
| clearable | 是否可清空 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |

> 完整 API 请参考 [Element Plus Select](https://element-plus.org/zh-CN/component/select.html)。
