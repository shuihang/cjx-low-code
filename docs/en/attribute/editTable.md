<script setup>
  import popover from '../../components/popover.vue'
</script>

# EditTable Attributes Documentation

## EditTable

| Parameter | Description | Type |
| --------------- | ------------- | :---: |
| option | Table configuration | `EditTableOption`[Details](#Option) |
| modelValue | Data bound to the table | `Array` |
| isView | Whether to read-only mode | `Boolean` |
| prop | Data property name bound to the table. If this component is nested in an `XForm` component and form validation is required, this parameter must be configured. Configuration rule (if `modelValue` (data bound to the table form) is bound to `form.arr`, then `prop='arr'`) | `string` |

## Option

| Parameter | Description | Type | Default Value |
| ------------- | ------------- | :---: | :---: |
| rowKey | Key of row data, used to optimize table rendering; Required when using copyBtn functionality, this property must correspond to a unique identifier of the data | `string` | id |
| copyBtn | Whether to display the copy button. When copyBtn is true, the rowKey property must correspond to a unique identifier of the data | `boolean` | false |
| delBtn | Whether to display the delete button | `boolean` | false |
| addBtn | Whether to display the add button | `boolean` | false |
| sortable | Whether drag-and-drop sorting is allowed | `boolean` | false |
| border | Whether to have vertical borders | `boolean` | false |
| index | Whether to show sequence numbers | `boolean` | false |
| column | Column configuration items | `Array`[Details](#Column) | - |

## Column

| Parameter | Description | Type | Default Value |
| ------------- | ------------- | :---: | :---: |
| label | Column header | `string \| VNode` | - |
| prop | Property name for column header content | `string` | - |
| type | Column type | <popover content="'input' \| 'select' \| 'inputNumber'">`enum`</popover> | input |
| dicData | Dictionary data | `Array` | - |
| width | Column width | `string \| number` | 90 |
| minWidth | Minimum column width. The difference with `width` is that `width` is fixed, while `min-width` distributes the remaining width proportionally to columns with `min-width` set | `number \| string` | - |
| rules | Form validation rules | `Array` | - |
| tip | Helper text for content | `string` | - |
| tipPlacement | Position of helper text | <popover content="'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'">`enum`</popover> | - |
| hide | Whether to hide | `Boolean` | true |
| on | Event | <popover content="{[key in `on${Capitalize<string>}`]: (...args: any[]) => void }">`Function`</popover> | - |

## Events

| Event Name | Description | Type | Callback Parameters |
| ------------- | ------------- | :---: | :---: |
| addChange | Add button click event | <popover content="(row: any, index: number) => void">`Function`</popover> | - |
| delChange | Delete button click event | <popover content="(row: any, index: number) => void">`Function`</popover> | - |
| copyChange | Copy button click event | <popover content="(row: any, index: number) => void">`Function`</popover> | - |
| sortableChange | Event triggered by drag sorting | <popover content="(sortable: SortableEvent) => void">`Function`</popover> | - |

## Slot

| Slot Name | Description | Scope Parameters |
| ------------- | ------------- | :---: |
| headerMenu | Table header operation bar slot | - |
| menu | Operation bar slot | - |
| `prop` | Table slot, using the prop from [Column](#Column) as the slot name. For example, if column: [{prop: 'test'}], the slot name is `#test` | `{ row, $index }` |