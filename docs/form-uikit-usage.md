# Form 组件 UIKit 使用指南

## 概述

Form 组件现已支持多组件库渲染，你可以通过传入 `uiKit` 和 `componentMap` 来使用不同的 UI 组件库（如 Antdv、Element Plus 等）。

## 默认行为

如果不传入 `uiKit` 和 `componentMap`，Form 组件会默认使用 **Element Plus** 组件库。

```vue
<template>
  <!-- 默认使用 Element Plus -->
  <XForm :form="form" :schemaField="schemaField" />
</template>
```

## 使用 Antdv

```vue
<template>
  <XForm 
    :form="form" 
    :schemaField="schemaField"
    :uiKit="antdvUIKit"
    :componentMap="antdvComponentMap"
  />
</template>

<script setup>
import { XForm, antdvUIKit, antdvComponentMap } from '@cjx-low-code/components/form'
import { ref } from 'vue'

const form = ref({
  name: '',
  type: ''
})

const schemaField = [
  { prop: 'name', label: '名称', type: 'input' },
  { prop: 'type', label: '类型', type: 'select', dicData: [...] }
]
</script>
```

## 自定义组件映射

你可以只覆盖部分组件，保留其他组件的默认行为：

```vue
<template>
  <XForm 
    :form="form" 
    :schemaField="schemaField"
    :componentMap="customComponentMap"
  />
</template>

<script setup>
import { XForm, elementPlusComponentMap } from '@cjx-low-code/components/form'
import { MyCustomInput, MyCustomSelect } from './custom-components'
import { ref } from 'vue'

// 继承默认映射，只覆盖部分组件
const customComponentMap = {
  ...elementPlusComponentMap,
  input: {
    component: MyCustomInput,
    placeholder: '请输入',
    props: ['maxlength', 'placeholder']
  },
  select: {
    component: MyCustomSelect,
    placeholder: '请选择'
  }
}

const form = ref({ name: '', type: '' })
const schemaField = [
  { prop: 'name', label: '名称', type: 'input' },
  { prop: 'type', label: '类型', type: 'select' }
]
</script>
```

## 完全自定义 UIKit

如果你使用其他组件库（如 Naive UI、TDesign 等），可以完全自定义 UIKit：

```typescript
import { NCol, NRow, NFormItem, NTooltip } from 'naive-ui'
import type { FormUIKit, FormComponentMap } from '@cjx-low-code/components/form'

// 定义 UIKit
export const naiveUIKit: FormUIKit = {
  Col: NCol,
  Row: NRow,
  FormItem: NFormItem,
  Tooltip: NTooltip
}

// 定义组件映射
export const naiveComponentMap: FormComponentMap = {
  input: {
    component: NInput,
    placeholder: '请输入'
  },
  select: {
    component: NSelect,
    placeholder: '请选择'
  }
  // ... 其他组件
}
```

```vue
<template>
  <XForm 
    :form="form" 
    :schemaField="schemaField"
    :uiKit="naiveUIKit"
    :componentMap="naiveComponentMap"
  />
</template>

<script setup>
import { XForm } from '@cjx-low-code/components/form'
import { naiveUIKit, naiveComponentMap } from './naive-ui-kit'
</script>
```

## UIKit 接口定义

```typescript
interface FormUIKit {
  /** 栅格列组件 */
  Col: Component
  /** 栅格行组件 */
  Row: Component
  /** 表单项容器 */
  FormItem: Component
  /** 工具提示组件（可选） */
  Tooltip?: Component
  /** 图标组件（可选） */
  Icon?: Component
}
```

## 注意事项

1. **布局组件必须兼容**：UIKit 中的 `Col`、`Row`、`FormItem` 组件需要支持类似的 props 接口
2. **校验规则格式**：不同组件库的表单校验规则格式可能不同，目前保持 Element Plus 格式
3. **查看模式**：目前查看模式（RenderViewFormVNode）仍使用 Element Plus 的 Descriptions 组件，如需支持其他组件库需要额外配置
4. **搜索表单**：RenderSearchFormVNode 同样支持 UIKit 配置

## 类型导出

```typescript
import type { 
  FormUIKit, 
  FormComponentMap,
  FormItemRule,
  ColProps,
  FormItemProps 
} from '@cjx-low-code/components/form'
```
