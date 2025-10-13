# $XDialog Attributes Documentation

## Examples

1. [Basic Usage](/zh-cn/components/dialog#基础用法)

## props

| Parameter | Description | Type | Default Value |
| ------------- | ------------- | :---: | -------------  |
| [option](#Option) | Dialog configuration options and props for embedded components, as well as $emit communication events (emitMethods) | [DialogDirectiveProps](#Option) | - |
| contentStyle | Dialog content area style | `CSSProperties` | - |

### option

::: tip option (`DialogDirectiveProps` type definition)

:::
| Parameter | Description | Type | Default Value |
| ------------- | ------------- | :---: | -------------  |
| title | Dialog title | `string` | - |
| width | Dialog width | `string \| number` | 80% |
| menu | Whether to display the dialog operation area | `boolean` | `true` |
| loading | Whether the confirm button has a loading animation after being clicked | `boolean` | `true`|
| showCloseBtn | Whether to display the close button | `boolean` | `true` |
| closeBtnText | Close button text | `string \| number` | Close |
| onClose | Callback triggered when the close button is clicked | `() => void` | - |
| showSaveBtn | Whether to display the confirm button | `boolean` | `false` |
| saveBtnText | Confirm button text | `string \| number` | Confirm |
| onSave | Callback for the confirm event | `(done: () => void, data?: any) => void` | `done` is used to close the loading state of the confirm button |
| onFullscreen | Callback triggered when switching to fullscreen mode | `(v: boolean) => void` | `v` indicates whether it is fullscreen |
| props | Props passed to components nested inside the dialog. Components inside the dialog receive props through props | `object` | - |
| emitMethods | Methods in this collection will be encapsulated as events. Components inside the dialog can communicate directly through $emit. If no $emit communication is performed by components inside the dialog, it will be an empty object {} | `object` | - |
