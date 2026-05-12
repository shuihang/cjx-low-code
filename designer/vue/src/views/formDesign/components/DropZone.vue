<template>
  <div class="sortable-container w-100%">
    <FormProvider :form="form">
      <Form>
        <SchemaField :schema="components" />
      </Form>
    </FormProvider>

    <!-- <el-row :gutter="8" class="smart-layout">
      <el-col
        v-for="(item, index) in components"
        :key="item.prop"
        :span="item.span"
        class="layout-item"
      >
        <EditWrapper
          :id="item.prop"
          :option="item"
          :index="index"
          @move-item="moveItem"
          @set-active="setActive"
          @delete-item="deleteItem"
        >
          <FormItemComponents :option="item" />
        </EditWrapper>
      </el-col>
    </el-row> -->

    <!-- 插入指示器 -->
    <div
      v-if="insertIndicator.show"
      class="insert-indicator"
      :style="insertIndicator.style"
      :data-type="insertIndicator.type"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElCol, ElRow } from 'element-plus'
import {
  Checkbox,
  CheckboxGroup,
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Select,
  Switch
} from '@cjx-low-code/element-plus'
import { createForm } from '@cjx-low-code/core'
import { FormProvider, createSchemaField } from '@cjx-low-code/vue'
import EditWrapper from './EditWrapper'
import FormItemComponents from './FormItemComponents'
import useEditorStore from '@/store/modules/editor'

const { SchemaField, SchemaFieldMarkup, defineSchema } = createSchemaField({
  components: {
    Input,
    InputNumber,
    Select,
    Radio,
    RadioGroup,
    Checkbox,
    CheckboxGroup,
    Switch,
    FormItem
  }
})

const form = createForm({})

const { components } = storeToRefs(useEditorStore())
const editorStore = useEditorStore()

// 插入指示器状态
const insertIndicator = reactive({
  show: false,
  style: {},
  type: 'vertical' // 'vertical' 或 'horizontal'
})

// 布局状态
const containerWidth = ref(0)
const canFitTwoColumns = ref(false)

// 判断是否应该使用水平布局
const shouldUseHorizontalLayout = computed(() => {
  return canFitTwoColumns.value && components.value.length >= 2
})

// 检测容器宽度
const checkContainerWidth = () => {
  return
  const container = document.querySelector('.sortable-container')
  if (container) {
    containerWidth.value = container?.clientWidth || 0
    // 只有当容器足够宽且元素数量大于1时才考虑水平布局
    // 假设每个元素最小宽度为 300px，如果能容纳两个就水平排列
    canFitTwoColumns.value = containerWidth.value >= 600 && components.value.length > 1

    console.log('布局检测:', {
      containerWidth: containerWidth.value,
      componentsCount: components.value.length,
      canFitTwoColumns: canFitTwoColumns.value,
      shouldUseHorizontalLayout: shouldUseHorizontalLayout.value
    })
  }
}

// 监听窗口大小变化
const handleResize = () => {
  checkContainerWidth()
}

// 监听组件数量变化，重新计算布局
watch(
  () => components.value.length,
  () => {
    checkContainerWidth()
  }
)

onMounted(() => {
  checkContainerWidth()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 移动表单项的方法
const moveItem = (fromIndex: number, toIndex: number) => {
  if (fromIndex === toIndex) return
  console.log('moveItem', fromIndex, toIndex)
  // 使用 store 的方法来移动组件
  editorStore.moveComponents(fromIndex, toIndex)
}

// 更新插入指示器位置
const updateInsertIndicator = (clientOffset: any) => {
  if (!clientOffset) {
    insertIndicator.show = false
    return
  }

  const container = document.querySelector('.sortable-container')
  if (!container) {
    insertIndicator.show = false
    return
  }

  const containerRect = container.getBoundingClientRect()
  const items = document.querySelectorAll('.sortable-container .layout-item')

  if (shouldUseHorizontalLayout.value) {
    // 水平布局模式：支持左右排列
    updateHorizontalIndicator(clientOffset, containerRect, items)
  } else {
    // 垂直布局模式：支持上下排列
    updateVerticalIndicator(clientOffset, containerRect, items)
  }
}

// 垂直布局的插入指示器
const updateVerticalIndicator = (clientOffset: any, containerRect: any, items: any) => {
  let insertY = containerRect.top

  // 如果拖拽到容器顶部
  if (clientOffset.y <= containerRect.top) {
    insertY = containerRect.top
  }
  // 如果拖拽到容器底部
  else if (clientOffset.y >= containerRect.bottom) {
    insertY = containerRect.bottom
  }
  // 拖拽到元素之间
  else {
    for (const item of items) {
      const rect = item.getBoundingClientRect()
      const middleY = (rect.top + rect.bottom) / 2

      if (clientOffset.y <= middleY) {
        insertY = rect.top
        break
      }
      insertY = rect.bottom
    }
  }

  insertIndicator.show = true
  insertIndicator.type = 'vertical'
  insertIndicator.style = {
    position: 'absolute',
    left: '0',
    right: '0',
    top: `${insertY - containerRect.top}px`,
    height: '2px',
    backgroundColor: '#1890ff',
    zIndex: 1000,
    pointerEvents: 'none'
  }
}

// 水平布局的插入指示器
const updateHorizontalIndicator = (clientOffset: any, containerRect: any, items: any) => {
  // 在水平布局中，我们需要考虑左右位置
  let insertX = containerRect.left
  let insertY = containerRect.top
  let isVertical = false

  // 检查是否在现有元素附近
  for (const item of items) {
    const rect = item.getBoundingClientRect()

    // 检查是否在元素上方（垂直插入）
    if (clientOffset.y <= rect.top && clientOffset.x >= rect.left && clientOffset.x <= rect.right) {
      insertY = rect.top
      isVertical = true
      break
    }
    // 检查是否在元素下方（垂直插入）
    else if (
      clientOffset.y >= rect.bottom &&
      clientOffset.x >= rect.left &&
      clientOffset.x <= rect.right
    ) {
      insertY = rect.bottom
      isVertical = true
      break
    }
    // 检查是否在元素左侧（水平插入）
    else if (
      clientOffset.x <= rect.left &&
      clientOffset.y >= rect.top &&
      clientOffset.y <= rect.bottom
    ) {
      insertX = rect.left
      insertY = rect.top
      break
    }
    // 检查是否在元素右侧（水平插入）
    else if (
      clientOffset.x >= rect.right &&
      clientOffset.y >= rect.top &&
      clientOffset.y <= rect.bottom
    ) {
      insertX = rect.right
      insertY = rect.top
      break
    }
  }

  // 如果拖拽到容器边缘
  if (clientOffset.y <= containerRect.top) {
    insertY = containerRect.top
    isVertical = true
  } else if (clientOffset.y >= containerRect.bottom) {
    insertY = containerRect.bottom
    isVertical = true
  }

  insertIndicator.show = true
  if (isVertical) {
    // 垂直插入线
    insertIndicator.type = 'vertical'
    insertIndicator.style = {
      position: 'absolute',
      left: '0',
      right: '0',
      top: `${insertY - containerRect.top}px`,
      height: '2px',
      backgroundColor: '#1890ff',
      zIndex: 1000,
      pointerEvents: 'none'
    }
  } else {
    // 水平插入线
    insertIndicator.type = 'horizontal'
    insertIndicator.style = {
      position: 'absolute',
      left: `${insertX - containerRect.left}px`,
      top: `${insertY - containerRect.top}px`,
      width: '2px',
      height: '40px',
      backgroundColor: '#1890ff',
      zIndex: 1000,
      pointerEvents: 'none'
    }
  }
}

const setActive = (id: string) => {
  useEditorStore().setActive(id)
}

const deleteItem = () => {
  useEditorStore().deleteComponents()
}

// 一个辅助函数，用于根据鼠标位置计算悬停位置的索引
const findHoverIndex = (clientOffset: any) => {
  if (!clientOffset) return 0

  const items = document.querySelectorAll('.sortable-container .layout-item')
  if (items.length === 0) return 0

  const container = document.querySelector('.sortable-container')
  if (!container) return 0

  const containerRect = container.getBoundingClientRect()

  if (shouldUseHorizontalLayout.value) {
    // 水平布局模式：考虑左右位置
    return findHorizontalHoverIndex(clientOffset, containerRect, items)
  } else {
    // 垂直布局模式：只考虑上下位置
    return findVerticalHoverIndex(clientOffset, containerRect, items)
  }
}

// 垂直布局的悬停索引计算
const findVerticalHoverIndex = (clientOffset: any, containerRect: any, items: any) => {
  // 如果拖拽到容器顶部，返回第一个位置
  if (clientOffset.y <= containerRect.top) {
    return 0
  }

  // 如果拖拽到容器底部，返回最后一个位置
  if (clientOffset.y >= containerRect.bottom) {
    return items.length
  }

  // 遍历所有元素，找到最接近的位置
  for (const [i, item] of items.entries()) {
    const rect = item.getBoundingClientRect()
    const middleY = (rect.top + rect.bottom) / 2

    if (clientOffset.y <= middleY) {
      return i
    }
  }

  // 如果拖拽到所有元素下方，返回最后一个位置
  return items.length
}

// 水平布局的悬停索引计算
const findHorizontalHoverIndex = (clientOffset: any, containerRect: any, items: any) => {
  // 如果拖拽到容器顶部，返回第一个位置
  if (clientOffset.y <= containerRect.top) {
    return 0
  }

  // 如果拖拽到容器底部，返回最后一个位置
  if (clientOffset.y >= containerRect.bottom) {
    return items.length
  }

  // 在水平布局中，我们需要考虑元素的行和列位置
  for (const [i, item] of items.entries()) {
    const rect = item.getBoundingClientRect()

    // 检查是否在元素上方
    if (clientOffset.y <= rect.top) {
      return i
    }
    // 检查是否在元素下方
    else if (clientOffset.y >= rect.bottom) {
      continue
    }
    // 检查是否在元素左侧
    else if (clientOffset.x <= rect.left) {
      return i
    }
    // 检查是否在元素右侧
    else if (clientOffset.x >= rect.right) {
      continue
    }
    // 在元素内部，根据位置决定
    else {
      const middleX = (rect.left + rect.right) / 2
      if (clientOffset.x <= middleX) {
        return i
      } else {
        return i + 1
      }
    }
  }

  return items.length
}
</script>

<style scoped>
.sortable-container {
  min-height: 200px;
  position: relative;
}

/* 智能布局样式 */
.smart-layout {
  width: 100%;
}

.layout-item {
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

/* 确保拖拽元素不会显示列表标记 */
.drag-item {
  list-style: none;
  list-style-type: none;
}

.drag-item::marker {
  display: none;
}

/* 插入指示器样式 */
.insert-indicator {
  position: absolute;
  background-color: #1890ff;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 0 4px rgba(24, 144, 255, 0.6);
  animation: insertIndicatorPulse 1.5s ease-in-out infinite;
}

/* 垂直插入线 */
.insert-indicator[data-type='vertical'] {
  left: 0;
  right: 0;
  height: 2px;
}

/* 水平插入线 */
.insert-indicator[data-type='horizontal'] {
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

/* 响应式布局 */
@media (max-width: 768px) {
  .layout-item {
    margin-bottom: 12px;
  }
}
</style>
