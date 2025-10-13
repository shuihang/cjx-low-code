<script setup>
  import popover from '../../components/popover.vue'
</script>

# Form Attributes Documentation

## Form

| Parameter | Description | Type | Default Value |
| ------------- | ------------- | :---: | :---:  |
| form | Bound form value | `object` | - |
| option | Form configuration options, refer to Option configuration | `TableOption` | - |
| isView | Whether to view mode | `boolean` | false |
| contentStyle | Content area style | `CSSProperties` | - |
| menuStyle | Operation area style | `CSSProperties` | - |

## Option

| Parameter | Description | Type | Default Value |
| ------------- | ------------- | :---: | :---:  |
| labelWidth | Form item label width | `string` | 90px |
| formSpan | Number of grid columns occupied | `number` | 12 |
| menuBtn | Whether to display the form operation bar | `boolean` | true |
| submitBtn | Whether to display the submit button | `boolean` | true |
| submitBtnText | Submit button text | `string` | Submit |
| cancelBtn | Whether to display the cancel button | `boolean` | true |
| cancelBtnText | Cancel button text | `string` | Cancel |
| viewTabs | Tab | `ViewTabs[]` | - |
| column | Form item configurations | `FormColumnProps[]` | - |
| group | Form grouping configuration | `GroupInterface[]` | - |

## Column - Common Properties {#column}

| Parameter | Description | Type | Default Value |
| ------------- | ------------- | :---: | :---: |
| label | Form item label | `string \| VNode` | - |
| prop | Form item property name | `string` | - |
| type | Form item type | `FormItemType` | input |
| span | Form item grid span | `number` | 12 |
| rules | Form validation rules | <popover content="Array<Partial<FormItemRule>>">`RulesType`</popover> | - |
| placeholder | Placeholder text | `string` | - |
| clearable | Whether is clearable | `boolean` | false |
| disabled | Whether is disabled | `boolean` | false |
| tip | Helper text for content | `string \| VNode` | - |
| tipPlacement | Position of helper text | <popover content="top \| top-start \| top-end \| bottom \| bottom-start \| bottom-end \| left \| left-start \| left-end \| right \| right-start \| right-end">`enum`</popover> | right-start |
| style | Form item style | `CSSProperties` | - |
