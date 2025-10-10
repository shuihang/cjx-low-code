# $ZtDialog属性文档

#### 示例

::: tip 使用$ZtDialog组件的页面

:::

## props

| 参数  | 说明 | 类型 | 默认值 |
| ------------- | ------------- | :---: | -------------  |
| [option](#Option) | 弹窗的配置项以及嵌入在弹窗里面组件的props传参和$emit通信事件（emitMethods） | [DialogDirectiveProps](#Option) | - |
| contentStyle | 弹窗内容区域样式 | `CSSProperties` | - |

### option

::: tip option（`DialogDirectiveProps`类型定义）

:::
| 参数  | 说明 | 类型 | 默认值 |
| ------------- | ------------- | :---: | -------------  |
| title | 弹窗标题 | `string` | - |
| width | 弹窗宽度 | `string \| number` | 80% |
| menu | 是否显示弹窗操作区域 | `boolean` | `true` |
| loading | 确定按钮是否点击后有加载动画 | `boolean` | `true`|
| showCloseBtn | 是否显示关闭按钮 | `boolean` | `true` |
| closeBtnText | 关闭按钮文本 | `string \| number` | 关闭 |
| onClose | 点击关闭按钮的触发的回调 | `() => void` | - |
| showSaveBtn | 是否显示确定按钮 | `boolean` | `false` |
| saveBtnText | 确定按钮文本 | `string \| number` | 确定 |
| onSave | 确定事件的回调 | `(done: () => void, data?: any) => void` | `done`用来关闭确定按钮的loading状态 |
| onFullscreen | 切换全屏触发的事件回调  | `(v: boolean) => void` | `v`是否全屏 |
| props | 传给嵌套在弹窗里面组件的props， 套在弹窗里面组件使用props接收 | `object` | - |
| emitMethods | 该集合里面的方法会被封装成事件，弹窗里面的组件可以直接通过$emit进行通信 如果弹窗里面的组件没有进行$emit通信则为空对象{} | `object` | - |
