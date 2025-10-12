<script setup>
  import popover from '../../components/popover.vue'
</script>

# EditTable属性文档

## EditTable

| 参数  | 说明 | 类型 |
| --------------- | ------------- | :---: |
| option | 表格配置项 | `EditTableOption`[详情](#Option) |
| modelValue | 表格绑定的数据 | `Array` |
| isView | 是否为只读模式 | `Boolean` |
| prop | 表格绑定的数据属性名称，如果这个组件嵌套在`XFrom`组件里 在需要表单校验的情况下 该参数必须配置 配置规则(如果`modelValue`(表格表单绑定的数据)绑定的是`form.arr`那么`prop='arr'` ) | `string` |

## Option

| 参数  | 说明 | 类型 | 默认值 |
| ------------- | ------------- | :---: | :---: |
| rowKey | 行数据的 Key，用来优化 Table 的渲染；在使用 copyBtn功能时，该属性必需对应数据的唯一标识 | `string` | id |
| copyBtn | 是否显示复制按钮 copyBtn为true时，rowKey属性必需对应数据的唯一标识| `boolean` | false |
| delBtn | 是否显示删除按钮 | `boolean` | false |
| addBtn | 是否显示新增按钮 | `boolean` | false |
| sortable | 是否是否可以拖拽排序 | `boolean` | false |
| border | 是否带有纵向边框 | `boolean` | false |
| index | 是否有序号 | `boolean` | false |
| column | 列配置项 | `Array`[详情](#Column) | - |

## Column

| 参数  | 说明 | 类型 | 默认值 |
| ------------- | ------------- | :---: | :---: |
| label | 列标题 | `string \| VNode` | - |
| prop | 列标题的内容属性名称 | `string` | - |
| type | 列类型 | <popover content="'input' \| 'select' \| 'inputNumber'">`enum`</popover> | input |
| dicData | 字典数据 | `Array` | - |
| width | 对应列的宽度 | `string \| number` | 90 |
| minWidth | 对应列的最小宽度， 对应列的最小宽度， 与 `width`的区别是`width`是固定的，`min-width`会把剩余宽度按比例分配给设置了`min-width`的列 |`number \| string` | - |
| rules | 表单验证规则 | `Array` | - |
| tip | 内容提示辅助语 | `string` | - |
| tipPlacement | 内容提示辅助语位置 | <popover content="'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'">`enum`</popover> | - |
| hide | 是否隐藏 | `Boolean` | true |
| on | 事件 | <popover content="{[key in `on${Capitalize<string>}`]: (...args: any[]) => void }">`Function`</popover> | - |

## Events

| 事件名  | 说明 | 类型 | 回调参数 |
| ------------- | ------------- | :---: | :---: |
| addChange | 新增按钮点击事件 | <popover content="(row: any, index: number) => void">`Function`</popover> | - |
| delChange | 删除按钮点击事件 | <popover content="(row: any, index: number) => void">`Function`</popover> | - |
| copyChange | 复制按钮点击事件 | <popover content="(row: any, index: number) => void">`Function`</popover> | - |
| sortableChange | 拖动排序响应的事件 | <popover content="(sortable: SortableEvent) => void">`Function`</popover> | - |

## Slot

| 插槽名  | 说明 | 作用域参数 |
| ------------- | ------------- | :---: |
| headerMenu | 表格头部操作栏插槽 | - |
| menu | 操作栏插槽 | - |
| `prop` | 表格插槽,以[Column](#Column)里的prop做插槽名，例如column: [{prop: 'test'}]则插槽名为`#test` | `{ row, $index }` |