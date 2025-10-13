## $XDialog

### Introduction

`$XDialog` is a global dialog component used to display dialogs on the page, supporting custom content and styles.

### Registration Method

```ts
import { createApp , type App } from 'vue'
import { $XDialog } from 'cjx-low-code'
const app: App = createApp()
app.config.globalProperties.$XDialog = $XDialog(app._context)
```

### Basic Usage

<preview path="../../examples-en/dialog/basic/index.vue" class="vp-raw" :source="false" />

#### demo.vue Code

:::preview

demo-preview=../../examples-en/dialog/basic/demo.vue

:::
