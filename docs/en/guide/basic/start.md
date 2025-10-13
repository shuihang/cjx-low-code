# Quick Start

This section will introduce how to use Cjx Low Code in a project.

### Usage

### Complete introduction

### If you are not very concerned about the size of the packaged file, then using a full import would be more convenient.

::: tip
  main.ts
:::

```ts
// main.ts
import { createApp } from 'vue'
import CjxLowCode  from 'cjx-low-code'
import 'cjx-low-code/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(CjxLowCode)
app.mount('#app')

```

## Volar Support

If you use Volar, specify the global component type in tsconfig.json through compilerOptions.type.

```json tsconfig.json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["cjx-low-code/global.d.ts"]
  }
}
```

## On-demand import

If you only use some components, you can import components as needed.

```ts
// main.ts
import { createApp } from 'vue'
import { XCrud, XForm } from 'cjx-low-code'
import 'cjx-low-code/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(XCrud)
app.use(XForm)
app.mount('#app')
```

## Manual import

```vue
// App.vue
<template>
  <x-crud>Cjx Low Code</x-crud>
</template>

<script lang="ts" setup>
import { XCrud } from 'cjx-low-code'

</script>
```
