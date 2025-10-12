<script setup>
  import popover from '../../components/popover.vue'
</script>

# Crud属性文档

```js {4}
//crud组件全局配置
app.use(XCrud)
```

## Crud

| 参数  | 说明 | 类型 |
| --------------- | ------------- | :---: |
| v-model:form | 绑定表单值 | `object` |
| data | 显示的数据 | `array` |
| option | 表单配置项参考Option配置 | `TableOption` 
| before-open | 弹窗表单打开前的回调，会暂停Dialog的打开，`done`用于打开Dialog，`type`（check/查看，create/新增， update/编辑）为当前窗口的类型，`row`为弹窗表单的绑定的数据新增时为undefined | <popover content="(type, row, done) => void">`Function`</popover> |
| dialog-close | 弹窗关闭前的回调,type为当前窗口的类型  | <popover content="(type) => void">`Function`</popover> |
| permission | 表格多个按钮权限控制，采用函数方式可以精确到行控制 | `CrudPermission` |
| search | 搜索变量 | `object` |
| page | 分页变量参考Page参数 | `CrudPageProps` |
| span-method | 合并行或列的计算方法 | <popover content="(data: { columns: any[], data: any[] })=>( VNode \| string )[]">`Function`</popover> |
| summary-method | 自定义的合计计算方法 | <popover content="({ columns, data }) => {}">`Function`</popover> |

## Page

| 参数  | 说明 | 类型 | 默认值 |
| ------------- | ------------- | ------------- | :---: |
| currentPage | 当前页数 | `number` | 1 |
| pageSize | 每页显示条目个数 | `number` | 10 |
| total | 总条目数 | `number` | 0 |
| background | 是否为分页按钮添加背景色 | `boolean` | true |
| layout | 组件布局，子组件名用逗号分隔 | <popover content="Array<'prev' \| 'pager' \| 'next' \| 'jumper' \| '->' \| 'sizes '\|'total' \| 'slot'>">`Array`</popover> | [total, sizes, prev, pager, next, jumper] |
| pageSizes | 每页显示个数选择器的选项设置 | `number[]` | [10, 20, 30, 40] |

## Option

| 参数  | 说明 | 类型 | 默认值 |
| ------------- | ------------- | :---: | :---: |
| title | 表格标题 | `string \| VNode` | - |
| height | 表格高度 | `string` | - |
| maxHeight | 表格的最大高度。 合法的值为数字或者单位为 px 的高度 | `string` | - |
| index | 是否有序号栏 | `boolean`  | false |
| indexText | 序号栏文本内容  | `string` | 序号 |
| lazy | 表格组件是否懒加载子节点数据 | `boolean` | false |
| border | 是否带有纵向边框 | `boolean` | false |
| labelWidth | 表单项的文字宽度 | `number` | 90 |
| selection | 是否有选择框 | `boolean` | false |
| selectionWidth | 复选框栏宽度 | `string` | 50 |
| rowKey | 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。 | `string` | id |
| menu | 是否显示操作栏 | `boolean` | false |
| menuTitle | 操作栏标题 | `string` | 操作 |
| menuWidth | 操作栏宽度 | `string` | 220px |
| menuMinWidth | 操作栏最小宽度 | `string` | 220px |
| menuFixed | 操作栏列是否固定在左侧或者右侧。 true 表示固定在左侧 | `boolean \| left \| right` | right |
| menuHeaderAlign |操作栏表头的对齐方式 | `left \| center \| right` | center |
| sortable |是否开启拖拽排序 | `boolean` | false |
| menuHeaderRight | 表格头部菜单栏右边是否显示 | `boolean` | true |
| column |表头配置 | `ColumnProps[]`[详情](#Column) | - |
| group |表单分组 | `TableGroupInterface[]` | - |
| tableLoading |表格等待框的控制 | `boolean` | false |
| highlightCurrentRow |是否要高亮当前行 | `boolean` | false |
| searchLabelWidth | 搜索项标题宽度 | `number` | 90 |
| searchSpan | 搜索项框栅列 | `number` | 8 |
| defaultExpandAll | 是否默认展开所有行，当前表格包含展开行存在或者为树形表格时有效 | `boolean` | false |
| isDrawer | 弹窗是否为抽屉 | `boolean` | false |
| addTitle | 表格新增弹窗标题 | `string` | 新增 |
| editTitle | 表格修改弹窗标题 | `string` | 编辑 |
| viewTitle | 表格查看弹窗标题 | `string` | 查看 |
| dialogWidth | 表格弹窗宽度 | `string` | 80% |
| addBtn | 表格新增按钮 | `boolean` | false |
| delBtn | 表格删除按钮 | `boolean` | false |
| viewBtn | 表格查看按钮 | `boolean` | false |
| updateBtn | 修改按钮 | `boolean` | false |
| importBtn | 表格导入按钮 | `boolean` | false |
| excelBtn | 表格导出按钮 | `boolean` | false |
| viewTabs | tabs查看 | `ViewTabs[]` | - |
| isCard | 是否卡片 | `boolean` | true |
| menuBtn | 表单操作栏是否显示 | `boolean` | true |
| cancelBtn | 表格弹窗取消按钮 | `boolean` | true |
| submitBtn | 表格弹窗提交按钮 | `boolean` | true |
| submitBtnText | 表格弹窗提交按钮文本 | `string` | 确定 |

## Column {#Column}

| 参数  | 说明 | 类型 | 默认值 |
| ------------- | ------------- | :---: | :---: |
| label | 列标题 | `string \| VNode` | - |
| prop | 列标题的内容属性名称 | `string` | - |
| componentBind | 表单项的需要绑定的其他值 type为selectPeople/regionalGrid 的时候该参数必填  | string | - |
| type | 表单项的类型 | <popover content="input \| textarea \| inputNumber \| select \| checkbox \| datePicker \| radio \| radioButton \| cascader \| switch \| treeSelect \| upload \| sign \| regionalGrid \| deptSelect \|editTable \| selectPeople">`FormItemType`</popover> |  input |
| span | 表单项的栅列 | `number` | 12 |
| align | 对齐方式 | <popover content="left \| center \| right">`enum`</popover> | left |
| headerAlign | 表头对齐方式， 若不设置该项，则使用表格的对齐方式 默认left | <popover content="left \| center \| right">`enum`</popover> | left |
| fixed | 列是否固定在左侧或者右侧。 true 表示固定在左侧 | <popover content="boolean \| left \| right">`enum`</popover> | - |
| width |对应列的宽度 | `number \| string` | 90 |
| minWidth |对应列的最小宽度， 对应列的最小宽度， 与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列  | `number \| string` | - |
| showOverflowTooltip |当内容过长被隐藏时显示 | `boolean` | false |
| formatter |用来格式化内容 | <popover content="(row: any, column: TableColumnCtx<Column>, cellValue: any, index: number) => void">`Function`</popover> | |
| className | 列的 className | `string` | - |
| labelClassName | 列的 className | `string` | - |
| props | 数据字典属性的配置对象| `PropsInterface` | `{label: 'label', value: 'value'}` |
| dicData | 数据字典值 | `DicDataInterface` | - |
| dicAjaxResolve | 数据字典 接口函数返回的数据 | `Promise<any>` | - |
| searchSpan | 搜索项框栅列 | `number` | 8 |
| menuSpan | 搜索栏操作区域的栅列 | `number` | - |
| searchLabelWidth | 搜索项标题宽度 | `number` | 90 |
| search | 是否为搜索项 | `boolean` | - | false |
| searchPlaceholder | 搜索项辅助文字 | `string` | - |
| searchType | 搜索项的类型 默认搜索项的类型,不配置则取type的配置 | `FormItemType` | input |
| searchClearable | 搜索项清除 | `boolean` | true |
| rules | 表单校验条件 | <popover content="Array<Partial<FormItemRule>>">`RulesType`</popover> | - |
| display | 弹出表单当前项是否显示 | <popover content=" (props: {form: any, column: FormColumnProps[],index: number, _XBoxType?: DialogFormType}) => boolean">`boolean \| Function`</popover> | true |
| createDisplay | 表单新增时当前项是否显示 | <popover content=" (props: {form: any, column: FormColumnProps[],index: number, _XBoxType?: DialogFormType}) => boolean">`boolean \| Function`</popover> | true |
| updateDisplay | 表单编辑时当前项是否显示 | <popover content=" (props: {form: any, column: FormColumnProps[],index: number, _XBoxType?: DialogFormType}) => boolean">`boolean \| Function`</popover> | true |
| checkDisplay | 表单查看时当前项是否显示 | <popover content=" (props: {form: any, column: FormColumnProps[],index: number, _XBoxType?: DialogFormType}) => boolean">`boolean \| Function`</popover> | true |
| disabled | 弹出表单当前项是否禁用 | `boolean` | false` |
| createDisabled | 表单新增时当前项是否显示 | `boolean` | false |
| updateDisabled | 表单编辑时当前项是否显示 | `boolean` | false |
| checkDisabled | 表单查看时当前项是否显示 | `boolean` | false |
| labelWidth | 表单项标题宽度 | `number` | 90 |
| hide | 表格项是否隐藏 | `boolean` | false |
| setUpHide | 列不显示可以通过操作控制显示 | `boolean` | false |
| order | 表单位置排序，序号越大越靠前 | `number` | 1 |
| searchOrder | 搜索栏位置排序，序号越大越靠前 | `number` | 1 |
| tip | 内容提示辅助语 | `string \| VNode` | - |
| tipPlacement | 内容提示辅助语位置 | <popover content="top \| top-start \| top-end \| bottom \| bottom-start \| bottom-end \| left \| left-start \| left-end \| right \| right-start \| right-end">`enum`</popover> | right-start |
| style | 表单项的样式 | `CSSProperties` | - |
| sortable | 实现以该列为基准的排序 | `boolean` | false |
| on | 触发事件的对象集合 | `on?: {[key: string]: (event: any) => void}` | - |

### input
| 参数  | 说明 | 类型 | 默认值 |
| ------------- | ------------- | :---: | :---: |
| maxlength | 最大输入长度 | `string \| number` | - |
| minlength | 原生属性，最小输入长度 | `number` | - |
| show-word-limit | 是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效 | `boolean` | false |
| placeholder | 输入框占位文本 | `string` | - |
| clearable | 是否可清空 | `boolean` | false |
| size | 输入框尺寸，只在`type`不为 'textarea' 时有效 | <popover content="large \| default \| small">`enum`</popover> | default |

### inputNumber

`type`等于textarea的生效的配置项 具体参考[el-input-number][]

### textarea

`type`等于textarea的生效的配置项 具体参考[el-textarea][]

### select

`type`等于select的生效的配置项 具体参考[el-select][]

### checkbox

`type`等于checkbox的生效的配置项 具体参考[el-checkbox][]

### radio

`type`等于radio的生效的配置项 具体参考[el-radio][]

### radioButton

`type`等于radioButton的生效的配置项 具体参考[el-radio][]

### datePicker

`type`等于datePicker的生效的配置项 具体参考[el-date-picker][]

### cascader

`type`等于cascader的生效的配置项 具体参考[el-cascader][]

### switch

`type`等于switch的生效的配置项 具体参考[el-switch][]

### treeSelect

`type`等于treeSelect的生效的配置项 具体参考[el-tree-select][]

### editTable

`type`等于editTable的生效的配置项 具体参考[editTable][editTable]

## Group {#Group}

| 参数  | 说明 | 类型 | 可选值 | 默认值 |
| ------------- | ------------- | :---: | :---: | :---: |
| label | 分组标题 | `string \| VNode` | - | - |
| prop | 表单分组的属性名称 | `string` | - | - |
| slot | 是否插槽 | `boolean` | - | - |
| column | 表单的各项 | `FormColumnProps[]`[详情][form-column] | - | - |

## Events

| 事件名  | 说明 | 类型 | 回调参数 |
| ------------- | ------------- | :---: | :---: |
| row-save | 新增数据后点击确定触发该事件 | <popover content="(row: any, done: (isClear?: boolean) => void, index: number) => void">`Function`</popover> | `row`表单绑定的数据，`done`关闭弹窗的函数`isClear`默认true关闭弹窗清空表单，isClear/false就只清除按钮loading效果 |
| row-update | 编辑数据后点击确定触发该事件 | <popover content="(row: any, done: (isClear?: boolean) => void, index: number) => void">`Function`</popover> | `row`表单绑定的数据，`done`关闭弹窗的函数`isClear`默认true关闭弹窗清空表单，isClear/false就只清除按钮loading效果 |
| row-del | 删除数据后触发该事件 | <popover content="(row: any, index: number) => void">`Function`</popover> | `row`表格对应项的数据，`index`表格点击项 |
| row-click | 行点击触发该事件 | <popover content="(row: any, column: any, event: Event) => void">`Function`</popover> | `row`表格对应项的数据 |
| selection-change | 表格多选触发该事件 | <popover content="(selection: any[]) => void">`Function`</popover> | `selection`表格选中的数据 |
| current-change | 表格 | <popover content="(currentPage: number)=> void">`Function`</popover> | `currentPage`表格选中的数据 |

## Methods

| 方法名  | 说明 | 类型 | 参数 |
| ------------- | ------------- | :---: | :---: |
| doLayout | 对 Table 进行重新布局。 当表格可见性变化时，您可能需要调用此方法以获得正确的布局 |`Function` | - |
| closeDialogForm | 关闭表单弹窗 | `Function` | - |
| openDialogForm | 打开弹窗 | <popover content="(type: DialogFormType, row?: Row<any>, index?: number) =>void">`Function`</popover> | `type`弹窗类型check/查看，create/新增，update/修改，`row`表格对应的行数据，index 对应表格的第几行 |
| toggleRowRadio | 用于单选表格 | <popover content="(id: any) => void">`Function`</popover> |`id`表格数据里对应的rowKey默认为id |
| toggleRowSelection | 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则可直接设置这一行选中与否 | <popover content="(row: any, selected: boolean)=> void">`Function`</popover> | `row`表格对应的行数据，`selected`是否选中 |
| validate | 用于表单弹窗 表单校验的 下个版本即将淘汰请使用validateV2 | <popover content="(callback?: FormValidateCallback \| undefined) => void">`Function`</popover> | `callback`表单提交后触发的回调函数 |
| scrollToField | 用于表单弹窗 滚动到指定的字段 | <popover content="(prop: FormItemProp) => void">`Function`</popover> | `prop`column里的prop配置 |
| validateV2 | 表单校验 | - | - |
| clearValidate | 移除该表单项的校验结果 | <popover content="(props?: Arrayable<FormItemProp>) => void">`Function`</popover> | `props`是个数组，数组里的每一项是column里的prop配置 |
| validateField | 验证具体的某个字段 | <popover content="(props?: Arrayable<FormItemProp>) => void">`Function`</popover> | `props`是个数组，数组里的每一项是column里的prop配置 |

## Slot

| 插槽名  | 说明 | 作用域参数 |
| ------------- | ------------- | :---: |
| headerMenu | 表格头部操作栏插槽 | - |
| menu | 操作栏插槽 | - |
| page | 分页器插槽 | - |
| form | 表单插槽 | - |
| `prop` | 表格插槽,以[Column](#Column)里的prop做插槽名，例如column: [{prop: 'test'}]则插槽名为`#test` | `{ row, $index }` |
| `propSearch` | 搜索栏插槽,以[Column](#Column)里的prop拼接`Search`做插槽名，例如column: [{prop: 'test'}]则插槽名为`#testSearch` | `{ row }` |
| `propForm` | 表单插槽,以[Column](#Column)里的prop拼接`Form`做插槽名，例如column: [{prop: 'test'}]则插槽名为`#testForm` 作用域参数为 | - |  <popover content="FormColumnProps & { _XBoxType: 'check' | 'create' | 'update' }">`Object`</popover> |
| `propGroupForm` | 表单分组插槽,以[Group](#Group)里的prop拼接`Group`做插槽名，例如group: [{prop: 'test'}]则插槽名为`#testGroupForm` | `{ _XBoxType?: 'check' \| 'create' \| 'update' }`  |
| `propTabForm` | 表单tab插槽,以ViewTabs里的value拼接`TabForm`做插槽名，例如viewTabs: [{value: 'test'}]则插槽名为`#testTabForm` | `{ _XBoxType?: 'check' \| 'create' \| 'update' }`  |
| importHeader | 导入文件头部插槽 | - |
| formHeader | 表单弹窗头部位置插槽 | `{ _XBoxType?: 'check' \| 'create' \| 'update' }` |
| formFooter | 表单弹窗底部位置插槽 | `{ _XBoxType?: 'check' \| 'create' \| 'update' }` |

[form-column]: ../attribute/form.html#column
[editTable]: ../attribute/editTable.html
[el-input-number]: https://s-test.belle.cn/zh-CN/component/input-number.html
[el-textarea]: https://s-test.belle.cn/zh-CN/component/input.html
[el-select]: https://s-test.belle.cn/zh-CN/component/select.html
[el-checkbox]: https://s-test.belle.cn/zh-CN/component/checkbox.html
[el-radio]: https://s-test.belle.cn/zh-CN/component/radio.html
[el-date-picker]: https://s-test.belle.cn/zh-CN/component/date-picker.html
[el-cascader]: https://s-test.belle.cn/zh-CN/component/cascader.html
[el-switch]: https://s-test.belle.cn/zh-CN/component/switch.html
[el-tree-select]: https://s-test.belle.cn/zh-CN/component/tree-select.html