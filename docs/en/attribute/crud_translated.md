<script setup>
  import popover from '../../components/popover.vue'
</script>

# Crud Attributes Documentation

```js {4}
// crud component global configuration
app.use(XCrud)
```

## Crud

| Parameter | Description | Type |
| --------------- | ------------- | :---: |
| v-model:form | Bound form value | `object` |
| data | Data to display | `array` |
| option | Form configuration options, refer to Option configuration | `TableOption`
| before-open | Callback before the dialog form opens, which will pause the opening of the Dialog. `done` is used to open the Dialog, `type` (check/view, create/add, update/edit) is the type of the current window, `row` is the data bound to the dialog form, which is undefined when adding | <popover content="(type, row, done) => void">`Function`</popover> |
| dialog-close | Callback before the dialog closes, `type` is the type of the current window | <popover content="(type) => void">`Function`</popover> |
| permission | Control permissions for multiple buttons in the table, using functions for precise row control | `CrudPermission` |
| search | Search variables | `object` |
| page | Pagination variables, refer to Page parameters | `CrudPageProps` |
| span-method | Calculation method for merging rows or columns | <popover content="(data: { columns: any[], data: any[] })=>( VNode \| string )[]">`Function`</popover> |
| summary-method | Custom summary calculation method | <popover content="({ columns, data }) => {}">`Function`</popover> |

## Page

| Parameter | Description | Type | Default Value |
| ------------- | ------------- | ------------- | :---: |
| currentPage | Current page number | `number` | 1 |
| pageSize | Number of items displayed per page | `number` | 10 |
| total | Total number of items | `number` | 0 |
| background | Whether to add background color to pagination buttons | `boolean` | true |
| layout | Component layout, separated by commas for subcomponent names | <popover content="Array<'prev' \| 'pager' \| 'next' \| 'jumper' \| '->' \| 'sizes '\|'total' \| 'slot'>">`Array`</popover> | [total, sizes, prev, pager, next, jumper] |
| pageSizes | Option settings for the number of items displayed per page | `number[]` | [10, 20, 30, 40] |

## Option

| Parameter | Description | Type | Default Value |
| ------------- | ------------- | :---: | :---: |
| title | Table title | `string \| VNode` | - |
| height | Table height | `string` | - |
| maxHeight | Maximum height of the table. Valid values are numbers or heights in px | `string` | - |
| index | Whether to display a serial number column | `boolean`  | false |
| indexText | Serial number column text content | `string` | Serial Number |
| lazy | Whether the table component lazy-loads child node data | `boolean` | false |
| border | Whether to have vertical borders | `boolean` | false |
| labelWidth | Text width of form items | `number` | 90 |
| selection | Whether to have a selection checkbox | `boolean` | false |
| selectionWidth | Checkbox column width | `string` | 50 |
| rowKey | Key of row data, used to optimize table rendering; Required when using reserve-selection functionality and displaying tree data | `string` | id |
| menu | Whether to display the operation bar | `boolean` | false |
| menuTitle | Operation bar title | `string` | Operation |
| menuWidth | Operation bar width | `string` | 220px |
| menuMinWidth | Minimum width of the operation bar | `string` | 220px |
| menuFixed | Whether the operation bar column is fixed to the left or right. true means fixed to the left | `boolean \| left \| right` | right |
| menuHeaderAlign | Alignment of the operation bar header | `left \| center \| right` | center |
| sortable | Whether to enable drag-and-drop sorting | `boolean` | false |
| menuHeaderRight | Whether to display the right side of the table header menu bar | `boolean` | true |
| column | Header configuration | `ColumnProps[]`[Details](#Column) | - |
| group | Form grouping | `TableGroupInterface[]` | - |
| tableLoading | Control of the table loading indicator | `boolean` | false |
| highlightCurrentRow | Whether to highlight the current row | `boolean` | false |
| searchLabelWidth | Search item title width | `number` | 90 |
| searchSpan | Search item grid span | `number` | 8 |
| defaultExpandAll | Whether to expand all rows by default, valid when the table contains expandable rows or is a tree table | `boolean` | false |
| isDrawer | Whether the dialog is a drawer | `boolean` | false |
| addTitle | Table add dialog title | `string` | Add |
| editTitle | Table edit dialog title | `string` | Edit |
| viewTitle | Table view dialog title | `string` | View |
| dialogWidth | Table dialog width | `string` | 80% |
| addBtn | Table add button | `boolean` | false |
| delBtn | Table delete button | `boolean` | false |
| viewBtn | Table view button | `boolean` | false |
| updateBtn | Update button | `boolean` | false |
| importBtn | Table import button | `boolean` | false |
| excelBtn | Table export button | `boolean` | false |
| viewTabs | Tabs for view | `ViewTabs[]` | - |
| isCard | Whether to display as card | `boolean` | true |
| menuBtn | Whether to display the form operation bar | `boolean` | true |
| cancelBtn | Table dialog cancel button | `boolean` | true |
| submitBtn | Table dialog submit button | `boolean` | true |
| submitBtnText | Table dialog submit button text | `string` | Submit |

## Column {#Column}

| Parameter | Description | Type | Default Value |
| ------------- | ------------- | :---: | :---: |
| label | Column header | `string \| VNode` | - |
| prop | Property name for column header content | `string` | - |
| componentBind | Other values that need to be bound to form items, required when type is selectPeople/regionalGrid | string | - |
| type | Form item type | <popover content="input \| textarea \| inputNumber \| select \| checkbox \| datePicker \| radio \| radioButton \| cascader \| switch \| treeSelect \| upload \| sign \| regionalGrid \| deptSelect \|editTable \| selectPeople">`FormItemType`</popover> |  input |
| span | Form item grid span | `number` | 12 |
| align | Alignment | <popover content="left \| center \| right">`enum`</popover> | left |
| headerAlign | Header alignment, if not set, the table's alignment is used, default is left | <popover content="left \| center \| right">`enum`</popover> | left |
| fixed | Whether the column is fixed to the left or right. true means fixed to the left | <popover content="boolean \| left \| right">`enum`</popover> | - |
| width | Column width | `number \| string` | 90 |
| minWidth | Minimum column width. The difference with width is that width is fixed, while min-width distributes the remaining width proportionally to columns with min-width set | `number \| string` | - |
| showOverflowTooltip | Display when content is too long | `boolean` | false |
| formatter | Used to format content | <popover content="(row: any, column: TableColumnCtx<Column>, cellValue: any, index: number) => void">`Function`</popover> | |
| className | Column className | `string` | - |
| labelClassName | Column className | `string` | - |
| props | Configuration object for dictionary properties | `PropsInterface` | `{label: 'label', value: 'value'}` |
| dicData | Dictionary values | `DicDataInterface` | - |
| dicAjaxResolve | Data returned by the dictionary interface function | `Promise<any>` | - |
| searchSpan | Search item grid span | `number` | 8 |
| menuSpan | Grid span for the search bar operation area | `number` | - |
| searchLabelWidth | Search item title width | `number` | 90 |
| search | Whether it is a search item | `boolean` | - | false |
| searchPlaceholder | Search item placeholder text | `string` | - |
| searchType | Search item type, default search item type, if not configured, it takes the type configuration | `FormItemType` | input |
| searchClearable | Search item clearable | `boolean` | true |
| rules | Form validation rules | <popover content="Array<Partial<FormItemRule>>">`RulesType`</popover> | - |
| display | Whether the current item in the popup form is displayed | <popover content=" (props: {form: any, column: FormColumnProps[],index: number, _XBoxType?: DialogFormType}) => boolean">`boolean \| Function`</popover> | true |
| createDisplay | Whether the current item is displayed when adding a form | <popover content=" (props: {form: any, column: FormColumnProps[],index: number, _XBoxType?: DialogFormType}) => boolean">`boolean \| Function`</popover> | true |
| updateDisplay | Whether the current item is displayed when editing a form | <popover content=" (props: {form: any, column: FormColumnProps[],index: number, _XBoxType?: DialogFormType}) => boolean">`boolean \| Function`</popover> | true |
| checkDisplay | Whether the current item is displayed when viewing a form | <popover content=" (props: {form: any, column: FormColumnProps[],index: number, _XBoxType?: DialogFormType}) => boolean">`boolean \| Function`</popover> | true |
| disabled | Whether the current item in the popup form is disabled | `boolean` | false` |
| createDisabled | Whether the current item is displayed when adding a form | `boolean` | false |
| updateDisabled | Whether the current item is displayed when editing a form | `boolean` | false |
| checkDisabled | Whether the current item is displayed when viewing a form | `boolean` | false |
| labelWidth | Form item title width | `number` | 90 |
| hide | Whether the table item is hidden | `boolean` | false |
| setUpHide | Columns not displayed can be controlled to display through operations | `boolean` | false |
| order | Form item position sorting, the larger the number, the more forward | `number` | 1 |
| searchOrder | Search bar position sorting, the larger the number, the more forward | `number` | 1 |
| tip | Helper text for content | `string \| VNode` | - |
| tipPlacement | Position of helper text | <popover content="top \| top-start \| top-end \| bottom \| bottom-start \| bottom-end \| left \| left-start \| left-end \| right \| right-start \| right-end">`enum`</popover> | right-start |
| style | Form item style | `CSSProperties` | - |
| sortable | Enable sorting based on this column | `boolean` | false |
| on | Collection of event objects | `on?: {[key: string]: (event: any) => void}` | - |

### input
| Parameter | Description | Type | Default Value |
| ------------- | ------------- | :---: | :---: |
| maxlength | Maximum input length | `string \| number` | - |
| minlength | Native property, minimum input length | `number` | - |
| show-word-limit | Whether to display input word count, only valid when type = "text" or type = "textarea" | `boolean` | false |
| placeholder | Input placeholder text | `string` | - |
| clearable | Whether is clearable | `boolean` | false |
| size | Input size, only valid when `type` is not 'textarea' | <popover content="large \| default \| small">`enum`</popover> | default |

### inputNumber

`type` equals textarea's effective configuration items, refer to [el-input-number][] for details

### textarea

`type` equals textarea's effective configuration items, refer to [el-textarea][] for details

### select

`type` equals select's effective configuration items, refer to [el-select][] for details

### checkbox

`type` equals checkbox's effective configuration items, refer to [el-checkbox][] for details

### radio

`type` equals radio's effective configuration items, refer to [el-radio][] for details

### radioButton

`type` equals radioButton's effective configuration items, refer to [el-radio][] for details

### datePicker

`type` equals datePicker's effective configuration items, refer to [el-date-picker][] for details

### cascader

`type` equals cascader's effective configuration items, refer to [el-cascader][] for details

### switch

`type` equals switch's effective configuration items, refer to [el-switch][] for details

### treeSelect

`type` equals treeSelect's effective configuration items, refer to [el-tree-select][] for details

### editTable

`type` equals editTable's effective configuration items, refer to [editTable][editTable] for details

## Group {#Group}

| Parameter | Description | Type | Optional Values | Default Value |
| ------------- | ------------- | :---: | :---: | :---: |
| label | Group title | `string \| VNode` | - | - |
| prop | Property name for form grouping | `string` | - | - |
| slot | Whether is a slot | `boolean` | - | - |
| column | Form items | `FormColumnProps[]`[Details][form-column] | - | - |

## Events

| Event Name | Description | Type | Callback Parameters |
| ------------- | ------------- | :---: | :---: |
| row-save | Triggered after clicking confirm when adding data | <popover content="(row: any, done: (isClear?: boolean) => void, index: number) => void">`Function`</popover> | `row` is the data bound to the form, `done` is the function to close the dialog, `isClear` defaults to true to close the dialog and clear the form, isClear/false only clears the button loading effect |
| row-update | Triggered after clicking confirm when editing data | <popover content="(row: any, done: (isClear?: boolean) => void, index: number) => void">`Function`</popover> | `row` is the data bound to the form, `done` is the function to close the dialog, `isClear` defaults to true to close the dialog and clear the form, isClear/false only clears the button loading effect |
| row-del | Triggered after deleting data | <popover content="(row: any, index: number) => void">`Function`</popover> | `row` is the data corresponding to the table item, `index` is the clicked table item |
| row-click | Triggered when a row is clicked | <popover content="(row: any, column: any, event: Event) => void">`Function`</popover> | `row` is the data corresponding to the table item |
| selection-change | Triggered when multiple items are selected in the table | <popover content="(selection: any[]) => void">`Function`</popover> | `selection` is the data selected in the table |
| current-change | Table | <popover content="(currentPage: number)=> void">`Function`</popover> | `currentPage` is the current page number |

## Methods

| Method Name | Description | Type | Parameters |
| ------------- | ------------- | :---: | :---: |
| doLayout | Re-layout the Table. When the table visibility changes, you may need to call this method to get the correct layout |`Function` | - |
| closeDialogForm | Close the form dialog | `Function` | - |
| openDialogForm | Open the dialog | <popover content="(type: DialogFormType, row?: Row<any>, index?: number) =>void">`Function`</popover> | `type` dialog type check/view, create/add, update/edit, `row` table row data, index which row of the table |
| toggleRowRadio | Used for single selection table | <popover content="(id: any) => void">`Function`</popover> |`id` corresponds to rowKey in table data, defaults to id |
| toggleRowSelection | Used for multi-selection table, toggle the selected state of a row, if the second parameter is used, you can directly set whether this row is selected | <popover content="(row: any, selected: boolean)=> void">`Function`</popover> | `row` table row data, `selected` whether selected |
| validate | Used for form dialog form validation, will be deprecated in the next version, please use validateV2 | <popover content="(callback?: FormValidateCallback \| undefined) => void">`Function`</popover> | `callback` callback function triggered after form submission |
| scrollToField | Used for form dialog, scroll to the specified field | <popover content="(prop: FormItemProp) => void">`Function`</popover> | `prop` prop configuration in column |
| validateV2 | Form validation | - | - |
| clearValidate | Remove the validation results of the form item | <popover content="(props?: Arrayable<FormItemProp>) => void">`Function`</popover> | `props` is an array, each item in the array is the prop configuration in column |
| validateField | Validate a specific field | <popover content="(props?: Arrayable<FormItemProp>) => void">`Function`</popover> | `props` is an array, each item in the array is the prop configuration in column |

## Slot

| Slot Name | Description | Scope Parameters |
| ------------- | ------------- | :---: |
| headerMenu | Table header operation bar slot | - |
| menu | Operation bar slot | - |
| page | Pagination slot | - |
| form | Form slot | - |
| `prop` | Table slot, using the prop from [Column](#Column) as the slot name, for example, if column: [{prop: 'test'}], the slot name is `#test` | `{ row, $index }` |
| `propSearch` | Search bar slot, using the prop from [Column](#Column) concatenated with `Search` as the slot name, for example, if column: [{prop: 'test'}], the slot name is `#testSearch` | `{ row }` |
| `propForm` | Form slot, using the prop from [Column](#Column) concatenated with `Form` as the slot name, for example, if column: [{prop: 'test'}], the slot name is `#testForm` scope parameter is | - |  <popover content="FormColumnProps & { _XBoxType: 'check' | 'create' | 'update' }">`Object`</popover> |
| `propGroupForm` | Form grouping slot, using the prop from [Group](#Group) concatenated with `Group` as the slot name, for example, if group: [{prop: 'test'}], the slot name is `#testGroupForm` | `{ _XBoxType?: 'check' \| 'create' \| 'update' }`  |
| `propTabForm` | Form tab slot, using the value from ViewTabs concatenated with `TabForm` as the slot name, for example, if viewTabs: [{value: 'test'}], the slot name is `#testTabForm` | `{ _XBoxType?: 'check' \| 'create' \| 'update' }`  |
| importHeader | Import file header slot | - |
| formHeader | Form dialog header position slot | `{ _XBoxType?: 'check' \| 'create' \| 'update' }` |
| formFooter | Form dialog footer position slot | `{ _XBoxType?: 'check' \| 'create' \| 'update' }` |

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
