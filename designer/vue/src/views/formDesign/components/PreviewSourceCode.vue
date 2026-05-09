<template>
  <div>
    <pre>
      <code ref="codeBlock" class="json">{{ components }}</code>
    </pre>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import hljs from 'highlight.js'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/vs2015.css' // 你可以选择其他样式主题

import useEditorStore from '@/store/modules/editor'

const { components } = storeToRefs(useEditorStore())

const codeBlock = ref(null)
// 注册语言
hljs.registerLanguage('json', json)

onMounted(() => {
  // 确保DOM已渲染
  if (codeBlock.value) {
    hljs.highlightElement(codeBlock.value)
  }
})
</script>
