<template>
  <div class="preview-json">
    <p class="preview-json__tip">当前画布组件列表的 JSON（已排除不可序列化字段）。</p>
    <MonacoReadonlyViewer :model-value="jsonText" language="json" />
  </div>
</template>

<script setup lang="ts">
import MonacoReadonlyViewer from '@/components/common/MonacoReadonlyViewer.vue'
import useEditorStore from '@/store/modules/editor'

const editorStore = useEditorStore()
const components = computed(() => editorStore.components)

function replacer(_key: string, value: unknown) {
  if (_key === 'icon') return undefined
  if (typeof value === 'function') return undefined
  return value
}

const jsonText = computed(() => {
  try {
    return JSON.stringify(components.value, replacer, 2)
  } catch {
    return '[]'
  }
})
</script>

<style scoped>
.preview-json__tip {
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
  text-align: left;
}
</style>
