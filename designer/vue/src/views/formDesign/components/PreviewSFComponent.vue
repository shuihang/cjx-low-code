<template>
  <div class="preview-sf">
    <MonacoReadonlyViewer :model-value="generated" language="html" />
  </div>
</template>

<script setup lang="ts">
import MonacoReadonlyViewer from '@/components/common/MonacoReadonlyViewer.vue'
import useEditorStore from '@/store/modules/editor'
import {
  type DesignSchemaRow,
  renderSchemaMarkupSfcFromComponents
} from '@/utils/renderSchemaMarkupSfc'

const editorStore = useEditorStore()
const components = computed(() => editorStore.components)

const generated = computed(() =>
  renderSchemaMarkupSfcFromComponents(components.value as DesignSchemaRow[])
)
</script>

<style scoped>
.preview-sf__tip {
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
  text-align: left;
}

.preview-sf__tip code {
  font-size: 12px;
  padding: 0 4px;
  border-radius: 4px;
  background: var(--el-fill-color-light);
}
</style>
