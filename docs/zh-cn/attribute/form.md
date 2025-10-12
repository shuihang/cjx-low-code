<script setup>
  import popover from '../../components/popover.vue'
</script>

# Form属性文档

## Form

| 参数  | 说明 | 类型 | 默认值 |
| ------------- | ------------- | :---: | :---:  |
| form | 绑定表单值 | `object` | - |
| option | 表单配置项参考Option配置 | `TableOption` | - |
| isView | 是否查看模式 | `boolean` | false |
| contentStyle | 内容区域的样式 | `CSSProperties` | - |
| menuStyle | 操作区域样式 | `CSSProperties` | - |

## Option

| 参数  | 说明 | 类型 | 默认值 |
| ------------- | ------------- | :---: | :---:  |
| labelWidth | 表单项label宽度 | `string` | 90px |
| formSpan | 栅格占据的列数 | `number` | 12 |
| menuBtn | 表单操作栏是否显示 | `boolean` | true |
| submitBtn | 确定按钮是否显示 | `boolean` | true |
| submitBtnText | 确定按钮文本 | `string` | 确定 |
| cancelBtn | 取消按钮是否显示 | `boolean` | true |
| cancelBtnText | 取消按钮文本 | `string` | 取消 |
| viewTabs | tab | `ViewTabs[]` | - |
| column | 表单的各项配置 | `FormColumnProps[]` | - |
| group | 表单分组的配置 | `GroupInterface[]` | - |

## Column-共用属性 {#column}

| 参数  | 说明 | 类型 | 默认值 |
| ------------- | ------------- | :---: | :---: |
| label | 表单项的label | `string \| VNode` | - |
| prop | 表单项的属性名称 | `string` | - |
| type | 表单项的类型 | `FormItemType` | input |
| span | 表单项的栅列 | `number` | 12 |
| rules | 表单校验条件 | <popover content="Array<Partial<FormItemRule>>">`RulesType`</popover> | - |
| placeholder | 辅助文字 | `string` | - |
| clearable | 是否可清除 | `boolean` | false |
| disabled | 是否禁用 | `boolean` | false |
| tip | 内容提示辅助语 | `string \| VNode` | - |
| tipPlacement | 内容提示辅助语位置 | <popover content="top \| top-start \| top-end \| bottom \| bottom-start \| bottom-end \| left \| left-start \| left-end \| right \| right-start \| right-end">`enum`</popover> | right-start |
| style | 表单项的样式 | `CSSProperties` | - |
