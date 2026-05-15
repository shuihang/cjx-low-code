<template>
  <div class="create-component-list">
    <div class="flex flex-wrap items-center justify-between">
      <div
        v-for="(item, index) in defaultTextTemplates"
        :key="index"
        class="create-component-list-item w-[calc(100%/2-20px)]"
        @click="addClick(item as any)"
      >
        <el-button
          :id="`component-list-item_${index}`"
          class="w-100%"
          draggable="true"
          :contenteditable="false"
          @dragstart="(e) => onDragStart(e, item as FormComponentProps)"
        >
          <template #icon>
            <RenderVNode :v-node="item.icon()" />
          </template>
          {{ item.title }}
        </el-button>
      </div>
    </div>

    <!-- 插入指示器 -->
    <div
      v-if="insertIndicator.show"
      class="insert-indicator"
      :class="`insert-indicator--${insertIndicator.type}`"
      :style="insertIndicator.style"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import RenderVNode from './RenderVNode'
import type { FormComponentProps } from '@/defaultFormTemplates'
import getDefaultFormTemplates from '@/defaultFormTemplates'
import useTheme from '@/store/modules/theme'
import { calculateDesignerInsertPosition } from '@/utils/calculateDesignerInsertPosition'

interface DragEventHandlers {
  dragstart: (e: DragEvent) => void
  dragover: (e: DragEvent) => void
  drop: (e: DragEvent) => void
}

const { themeColor } = storeToRefs(useTheme())

const defaultTextTemplates = ref<FormComponentProps[]>(getDefaultFormTemplates(themeColor.value))

watch(
  () => themeColor.value,
  (newVal) => {
    defaultTextTemplates.value = getDefaultFormTemplates(newVal)
  }
)

const emit = defineEmits(['addItem'])

let enterComponent: FormComponentProps | null = null
let editorContainer: HTMLDivElement | null = null
let canvasArea: HTMLDivElement | null = null

// 插入指示器状态
const insertIndicator = reactive({
  show: false,
  style: {},
  type: 'vertical' // 'vertical' 或 'horizontal'
})

onMounted(async () => {
  await nextTick()
  editorContainer = document.querySelector('#editorContainer') as HTMLDivElement
  canvasArea = document.querySelector('#canvas-area') as HTMLDivElement

  document.body.addEventListener('dragend', () => {
    insertIndicator.show = false
    enterComponent = null
    editorContainer?.removeEventListener('dragover', handleDragOver)
    editorContainer?.removeEventListener('drop', handleDrop)
  })
})

onUnmounted(() => {
  editorContainer?.removeEventListener('dragover', handleDragOver)
  editorContainer?.removeEventListener('drop', handleDrop)
})

// 计算插入位置（与画布 SchemaField + data-designer-node-id 对齐）
const calculateInsertPosition = (clientX: number, clientY: number) => {
  if (!canvasArea) return { insertIndex: -1, insertY: 0, insertX: 0, type: 'vertical' as const }
  return calculateDesignerInsertPosition(canvasArea, clientX, clientY)
}

// 更新插入指示器
const updateInsertIndicator = (clientX: number, clientY: number) => {
  if (!canvasArea) {
    insertIndicator.show = false
    return
  }

  const { insertY, insertX, type } = calculateInsertPosition(clientX, clientY)
  const canvasRect = canvasArea.getBoundingClientRect()

  insertIndicator.show = true
  insertIndicator.type = type

  if (type === 'vertical') {
    // 垂直插入线（水平线）
    insertIndicator.style = {
      position: 'fixed',
      left: `${canvasRect.left}px`,
      right: `${window.innerWidth - canvasRect.right}px`,
      top: `${insertY}px`,
      height: '2px',
      backgroundColor: '#1890ff',
      zIndex: 1000,
      pointerEvents: 'none',
      boxShadow: '0 0 4px rgba(24, 144, 255, 0.6)'
    }
  } else {
    // 水平插入线（垂直线）
    insertIndicator.style = {
      position: 'fixed',
      left: `${insertX}px`,
      top: `${insertY}px`,
      width: '2px',
      height: '40px',
      backgroundColor: '#1890ff',
      zIndex: 1000,
      pointerEvents: 'none',
      boxShadow: '0 0 4px rgba(24, 144, 255, 0.6)'
    }
  }
}

const handleDragOver: DragEventHandlers['dragover'] = (e) => {
  e.preventDefault()
  // 更新插入指示器位置
  updateInsertIndicator(e.clientX, e.clientY)
}

const handleDrop: DragEventHandlers['drop'] = (e) => {
  insertIndicator.show = false

  if (!enterComponent) {
    editorContainer?.removeEventListener('dragover', handleDragOver)
    editorContainer?.removeEventListener('drop', handleDrop)
    return
  }

  const { insertIndex, type } = calculateInsertPosition(e.clientX, e.clientY)

  emit('addItem', {
    ...enterComponent,
    insertIndex: insertIndex >= 0 ? insertIndex : undefined,
    insertType: type
  })

  editorContainer?.removeEventListener('dragover', handleDragOver)
  editorContainer?.removeEventListener('drop', handleDrop)
  enterComponent = null
}

const addClick = (row: FormComponentProps) => {
  emit('addItem', row)
  editorContainer?.removeEventListener('dragover', handleDragOver)
  editorContainer?.removeEventListener('drop', handleDrop)
}

function onDragStart(e: DragEvent, row: FormComponentProps) {
  enterComponent = row
  editorContainer?.addEventListener('dragover', handleDragOver)
  editorContainer?.addEventListener('drop', handleDrop)
  try {
    e.dataTransfer?.setData('text/plain', row.title)
    e.dataTransfer!.effectAllowed = 'copy'
  } catch {
    /* ignore */
  }
}

// defineExpose({
//   defaultTextTemplates
// })
</script>

<style lang="scss" scoped>
.create-component-list {
  &-item {
    cursor: pointer;
    // width: 100%;
    margin-bottom: 12px;
    position: relative;
    height: auto;
  }
}

/* 插入指示器样式 */
.insert-indicator {
  position: fixed;
  background-color: #1890ff;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 0 4px rgba(24, 144, 255, 0.6);
  animation: insertIndicatorPulse 1.5s ease-in-out infinite;
}

/* 垂直插入指示器（水平线） */
.insert-indicator--vertical {
  height: 2px;
}

/* 水平插入指示器（垂直线） */
.insert-indicator--horizontal {
  width: 2px;
  height: 40px;
}

@keyframes insertIndicatorPulse {
  0%,
  100% {
    opacity: 1;
    transform: scaleY(1);
  }
  50% {
    opacity: 0.7;
    transform: scaleY(1.2);
  }
}
</style>
