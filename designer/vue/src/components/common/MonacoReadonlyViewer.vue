<template>
  <div ref="hostRef" class="monaco-readonly-host" :style="{ minHeight }" />
</template>

<script setup lang="ts">
import '@/utils/monacoWorkers'
import { useResizeObserver } from '@vueuse/core'
import * as monaco from 'monaco-editor'
import { ensureVueSfcMonacoHover } from '@/utils/monacoVueSfcHover'

const props = withDefaults(
  defineProps<{
    modelValue: string
    language?: 'json' | 'html' | 'typescript' | 'javascript'
    theme?: 'vs' | 'vs-dark'
    minHeight?: string
  }>(),
  {
    language: 'html',
    theme: 'vs',
    minHeight: 'min(65vh, 520px)'
  }
)

const hostRef = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null

function createEditor() {
  const el = hostRef.value
  if (!el) return

  editor?.dispose()
  editor = null

  editor = monaco.editor.create(el, {
    value: props.modelValue,
    language: props.language,
    readOnly: true,
    theme: props.theme,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    fontSize: 13,
    lineNumbers: 'on',
    automaticLayout: true,
    wordWrap: 'on',
    tabSize: 2,
    folding: true,
    renderWhitespace: 'selection',
    scrollbar: {
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10
    }
  })
}

watch(
  () => props.modelValue,
  (v) => {
    if (!editor) return
    const cur = editor.getValue()
    if (v !== cur) editor.setValue(v)
  }
)

watch(
  () => props.language,
  (lang) => {
    const model = editor?.getModel()
    if (!model) return
    monaco.editor.setModelLanguage(model, lang)
  }
)

watch(
  () => props.theme,
  (t) => {
    monaco.editor.setTheme(t)
  }
)

onMounted(() => {
  if (props.language === 'html') {
    ensureVueSfcMonacoHover(monaco)
  }
  nextTick(() => createEditor())
})

useResizeObserver(hostRef, () => {
  nextTick(() => editor?.layout())
})

onUnmounted(() => {
  editor?.dispose()
  editor = null
})
</script>

<style scoped>
.monaco-readonly-host {
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
