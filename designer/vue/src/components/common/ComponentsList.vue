<template>
  <div class="create-component-list">
    <div class="flex flex-wrap items-center justify-between">
      <div
        v-for="(item, index) in defaultTextTemplates"
        :key="index"
        class="create-component-list-item w-[calc(100%/2-20px)]"
        @click="addClick(item as any)"
        @mouseenter.stop="
          mouseEnter({ row: item as any, elementId: `component-list-item_${index}` })
        "
      >
        <el-button
          :id="`component-list-item_${index}`"
          class="w-100%"
          draggable="true"
          :contenteditable="false"
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
import { nextTick, onUnmounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import RenderVNode from './RenderVNode'
import type { FormComponentProps } from '@/defaultFormTemplates'
import getDefaultFormTemplates from '@/defaultFormTemplates'
import useTheme from '@/store/modules/theme'

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
    // 隐藏插入指示器
    insertIndicator.show = false
    editorContainer?.removeEventListener('dragover', handleDragOver)
    editorContainer?.removeEventListener('drop', handleDrop)
  })
})

onUnmounted(() => {
  editorContainer?.removeEventListener('dragover', handleDragOver)
  editorContainer?.removeEventListener('drop', handleDrop)
})

// 计算插入位置
const calculateInsertPosition = (clientX: number, clientY: number) => {
  if (!canvasArea) return { insertIndex: -1, insertY: 0, insertX: 0, type: 'vertical' }

  const canvasRect = canvasArea.getBoundingClientRect()
  const existingItems = canvasArea.querySelectorAll('.layout-item')

  // 如果画布中没有元素，插入到顶部
  if (existingItems.length === 0) {
    return { insertIndex: 0, insertY: canvasRect.top, insertX: canvasRect.left, type: 'vertical' }
  }

  // 计算相对于画布的位置
  const relativeX = clientX - canvasRect.left
  const relativeY = clientY - canvasRect.top

  // 遍历现有元素，找到插入位置
  for (const [i, existingItem] of existingItems.entries()) {
    const itemRect = existingItem.getBoundingClientRect()
    const itemRelativeTop = itemRect.top - canvasRect.top
    const itemRelativeBottom = itemRect.bottom - canvasRect.top
    const itemRelativeLeft = itemRect.left - canvasRect.left
    const itemRelativeRight = itemRect.right - canvasRect.left

    const itemMiddleY = (itemRelativeTop + itemRelativeBottom) / 2
    const itemMiddleX = (itemRelativeLeft + itemRelativeRight) / 2

    // 检查是否在元素内部或附近
    const isInItemY = relativeY >= itemRelativeTop && relativeY <= itemRelativeBottom
    const isInItemX = relativeX >= itemRelativeLeft && relativeX <= itemRelativeRight

    if (isInItemY && isInItemX) {
      // 在元素内部，根据位置决定插入方向
      if (relativeX <= itemMiddleX) {
        // 在元素左侧，水平插入
        return {
          insertIndex: i,
          insertY: itemRect.top,
          insertX: itemRect.left,
          type: 'horizontal'
        }
      } else {
        // 在元素右侧，水平插入到下一个位置
        return {
          insertIndex: i + 1,
          insertY: itemRect.top,
          insertX: itemRect.right,
          type: 'horizontal'
        }
      }
    } else if (isInItemY) {
      // 在元素的垂直范围内，但不在水平范围内
      if (relativeX <= itemRelativeLeft) {
        // 在元素左侧，水平插入
        return {
          insertIndex: i,
          insertY: itemRect.top,
          insertX: itemRect.left,
          type: 'horizontal'
        }
      } else if (relativeX >= itemRelativeRight) {
        // 在元素右侧，水平插入到下一个位置
        return {
          insertIndex: i + 1,
          insertY: itemRect.top,
          insertX: itemRect.right,
          type: 'horizontal'
        }
      }
    } else if (relativeY <= itemMiddleY) {
      // 在元素上方，垂直插入
      return {
        insertIndex: i,
        insertY: itemRect.top,
        insertX: itemRect.left,
        type: 'vertical'
      }
    }
  }

  // 如果鼠标在所有元素下方，插入到最后
  const lastItem = existingItems[existingItems.length - 1]
  const lastItemRect = lastItem.getBoundingClientRect()
  return {
    insertIndex: existingItems.length,
    insertY: lastItemRect.bottom,
    insertX: lastItemRect.left,
    type: 'vertical'
  }
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
  // 隐藏插入指示器
  insertIndicator.show = false

  // 计算插入位置
  const { insertIndex, type } = calculateInsertPosition(e.clientX, e.clientY)

  console.log('拖放位置:', {
    clientX: e.clientX,
    clientY: e.clientY,
    insertIndex,
    insertType: type
  })

  // 发送添加元素事件，包含插入位置和类型信息
  emit('addItem', {
    ...enterComponent,
    insertIndex: insertIndex >= 0 ? insertIndex : undefined,
    insertType: type
  })

  editorContainer?.removeEventListener('dragover', handleDragOver)
  editorContainer?.removeEventListener('drop', handleDrop)
}

const addClick = (row: FormComponentProps) => {
  emit('addItem', row)
  editorContainer?.removeEventListener('dragover', handleDragOver)
  editorContainer?.removeEventListener('drop', handleDrop)
}

// 鼠标拖拽结束
const mouseEnter = (data: { row: FormComponentProps; elementId: string }) => {
  const { row, elementId } = data
  const element = document?.getElementById(elementId) as HTMLDListElement
  // console.log(111, element.clientHeight)
  // console.log('enter-111111111', row.type)
  enterComponent = row
  editorContainer?.addEventListener('dragover', handleDragOver)
  editorContainer?.addEventListener('drop', handleDrop)
  // mouseStartDrop(row)
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
