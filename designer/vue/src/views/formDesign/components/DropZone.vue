<template>
  <div
    ref="canvasRootRef"
    class="sortable-container w-100%"
    @click.capture="onCanvasClickCapture"
    @pointermove.passive="onCanvasPointerMove"
    @pointerleave="onCanvasPointerLeave"
  >
    <FormProvider :form="form">
      <Form>
        <!--
          设计态：基座 ReactiveField 仅在 name 变化时重建 Field；用 :key 指纹在配置变化时重挂 SchemaField。
          指纹为稳定深度序列化（键排序、跳过 icon/函数），不必手写要跟踪的字段名。
        -->
        <SchemaField :key="designerSchemaSyncKey" :schema="designSchema" />
      </Form>
    </FormProvider>

    <!-- 悬停表单项上的虚线层：仅盖住当前项，挡住真实控件；按下可拖动排序 -->
    <div
      v-show="!!hoveredDesignerId"
      class="designer-hover-sheet"
      :class="{
        'designer-hover-sheet--same-selection': hoveredDesignerId === editorStore.currentElement
      }"
      :style="hoverSheetStyle"
      aria-hidden="true"
      @pointerdown.capture="onHoverSheetPointerDown"
    />

    <DesignerSelectionOverlay
      :root-el="canvasRootRef"
      @reorder-pointerdown="onOverlayReorderPointerDown"
    />

    <!-- 画布内拖动排序插入线 -->
    <div
      v-show="reorderDrop.show"
      class="designer-reorder-drop-line"
      :class="`designer-reorder-drop-line--${reorderDrop.type}`"
      :style="reorderDrop.style"
    />

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
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
  Checkbox,
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  TimeSelect
} from '@cjx-low-code/element-plus'
import { createForm } from '@cjx-low-code/core'
import { FormProvider, createSchemaField } from '@cjx-low-code/vue'
import { useDesignerCanvasReorder } from '../composables/useDesignerCanvasReorder'
import DesignerSelectionOverlay from './DesignerSelectionOverlay.vue'
import type { FormComponentProps } from '@/defaultFormTemplates'
import useEditorStore from '@/store/modules/editor'

const { SchemaField } = createSchemaField({
  components: {
    Input,
    InputNumber,
    Select,
    Radio,
    Checkbox,
    Switch,
    FormItem,
    Rate,
    Slider,
    TimePicker,
    TimeSelect
  }
})

const form = createForm({})

const editorStore = useEditorStore()
const components = computed(() => editorStore.components)

/** 不参与指纹的键：组件引用、函数等无法稳定序列化，也不影响 SchemaField 渲染 */
const DESIGNER_FINGERPRINT_SKIP_KEYS = new Set(['icon'])

/**
 * 对设计器 store 里的表单项做稳定深度序列化，用作 :key 指纹。
 * 键名排序 + 跳过 icon/函数，新增 schema 字段时无需再手写字段列表。
 */
function stableValueFingerprint(
  value: unknown,
  depth: number,
  maxDepth: number,
  seen: WeakSet<object>
): string {
  if (depth > maxDepth) return '"[MaxDepth]"'

  if (value === null || value === undefined) return 'null'

  const t = typeof value
  if (t === 'function' || t === 'symbol') return 'null'
  if (t === 'string' || t === 'number' || t === 'boolean') return JSON.stringify(value)
  if (t === 'bigint') return JSON.stringify(String(value))

  if (Array.isArray(value)) {
    return `[${value
      .map((item) => stableValueFingerprint(item, depth + 1, maxDepth, seen))
      .join(',')}]`
  }

  if (t !== 'object') return 'null'

  if (value instanceof Date) return JSON.stringify((value as Date).toISOString())

  const obj = value as Record<string, unknown>
  if (seen.has(obj)) return '"[Circular]"'
  seen.add(obj)

  const keys = Object.keys(obj)
    .filter((k) => !DESIGNER_FINGERPRINT_SKIP_KEYS.has(k))
    .sort()

  const inner = keys
    .map((k) => `${JSON.stringify(k)}:${stableValueFingerprint(obj[k], depth + 1, maxDepth, seen)}`)
    .join(',')

  return `{${inner}}`
}

function designerComponentFingerprint(c: unknown): string {
  return stableValueFingerprint(c, 0, 32, new WeakSet())
}

const designerSchemaSyncKey = computed(() =>
  components.value.map((c) => designerComponentFingerprint(c)).join('\u001E')
)

const getCanvasArea = () => document.querySelector('#canvas-area') as HTMLElement | null

const { reorderDrop, startReorder, teardownReorder } = useDesignerCanvasReorder(
  getCanvasArea,
  (from, to) => editorStore.moveComponents(from, to),
  () => editorStore.components.length,
  {
    getGhostLabel: (fromIndex) => {
      const row = editorStore.components[fromIndex] as { title?: string } | undefined
      const t = row?.title
      return typeof t === 'string' && t.length > 0 ? t : null
    }
  }
)

const canvasRootRef = ref<HTMLElement | null>(null)

/** 指针下的表单项 id；其上叠放 designer-hover-sheet 拦截控件事件 */
const hoveredDesignerId = ref('')
const hoverSheetStyle = ref<Record<string, string>>({})

let canvasPointerRaf = 0
let hoverGeomRaf = 0

function scheduleUpdateHoverGeometry() {
  cancelAnimationFrame(hoverGeomRaf)
  hoverGeomRaf = requestAnimationFrame(() => {
    nextTick(updateHoverSheetGeometry)
  })
}

function updateHoverSheetGeometry() {
  const root = canvasRootRef.value
  const id = hoveredDesignerId.value
  if (!root || !id) {
    hoverSheetStyle.value = {}
    return
  }

  const el = root.querySelector(`[data-designer-node-id="${CSS.escape(id)}"]`) as HTMLElement | null
  if (!el) {
    hoverSheetStyle.value = {}
    return
  }

  const cr = root.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  const left = r.left - cr.left + root.scrollLeft
  const top = r.top - cr.top + root.scrollTop

  hoverSheetStyle.value = {
    position: 'absolute',
    left: '0',
    top: '0',
    width: `${r.width}px`,
    height: `${r.height}px`,
    transform: `translate3d(${left}px, ${top}px, 0)`,
    zIndex: '5',
    boxSizing: 'border-box',
    pointerEvents: 'auto'
  }
}

/** 与 Formily Designable 类似：在真实表单项根节点上打标，选中框由独立层定位叠放 */
const designSchema = computed(() =>
  components.value.map((c) => {
    const row = c as FormComponentProps & { decoratorProps?: Record<string, unknown> }
    const prev = row.decoratorProps
    return {
      ...row,
      decoratorProps: {
        ...(prev && typeof prev === 'object' ? prev : {}),
        'data-designer-node-id': row.name
      }
    }
  })
)

function resolveDesignerNodeFromPoint(
  clientX: number,
  clientY: number,
  target: HTMLElement | null
): HTMLElement | null {
  if (!target || target.closest('.designer-aux-root')) return null

  const direct = target.closest('[data-designer-node-id]') as HTMLElement | null
  if (direct && !direct.closest('.designer-aux-root')) return direct

  const stack = document.elementsFromPoint(clientX, clientY)
  for (const el of stack) {
    if (!(el instanceof HTMLElement)) continue
    if (el.classList.contains('designer-hover-sheet')) continue
    if (el.classList.contains('designer-item-drag-sheet')) continue
    if (el.closest('.designer-aux-root')) continue
    const hit = el.closest('[data-designer-node-id]')
    if (hit) return hit as HTMLElement
  }
  return null
}

function resolveDesignerNodeFromEvent(e: MouseEvent | PointerEvent): HTMLElement | null {
  return resolveDesignerNodeFromPoint(e.clientX, e.clientY, e.target as HTMLElement | null)
}

function onCanvasPointerMove(e: PointerEvent) {
  const cx = e.clientX
  const cy = e.clientY
  cancelAnimationFrame(canvasPointerRaf)
  canvasPointerRaf = requestAnimationFrame(() => {
    const topEl = document.elementFromPoint(cx, cy) as HTMLElement | null
    if (topEl?.closest('.designer-aux-root')) {
      if (hoveredDesignerId.value !== '') {
        hoveredDesignerId.value = ''
        scheduleUpdateHoverGeometry()
      }
      return
    }

    const node = resolveDesignerNodeFromPoint(cx, cy, topEl)
    const id = node?.dataset?.designerNodeId ?? ''
    if (id !== hoveredDesignerId.value) {
      hoveredDesignerId.value = id
    }
    scheduleUpdateHoverGeometry()
  })
}

function onCanvasPointerLeave() {
  hoveredDesignerId.value = ''
  cancelAnimationFrame(canvasPointerRaf)
  cancelAnimationFrame(hoverGeomRaf)
  hoverSheetStyle.value = {}
}

function onCanvasClickCapture(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  if (!target) return
  if (target.closest('.designer-aux-root')) return

  const node = resolveDesignerNodeFromEvent(e)
  if (node) {
    const id = node.dataset.designerNodeId
    if (id) editorStore.setActive(id)
    return
  }

  if ((e.currentTarget as HTMLElement).contains(target)) {
    editorStore.setActive('')
  }
}

function onHoverSheetPointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  if ((e.target as HTMLElement | null)?.closest('.designer-aux-root')) return

  const id = hoveredDesignerId.value
  if (!id) return
  const from = editorStore.components.findIndex((c) => c.name === id)
  if (from < 0) return

  editorStore.setActive(id)
  startReorder(e, e.currentTarget as HTMLElement, from)
}

function onOverlayReorderPointerDown(payload: {
  e: PointerEvent
  captureEl: HTMLElement
  fromIndex: number
}) {
  startReorder(payload.e, payload.captureEl, payload.fromIndex)
}

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
  scheduleUpdateHoverGeometry()
}

let hoverResizeObserver: ResizeObserver | null = null

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
  window.addEventListener('scroll', scheduleUpdateHoverGeometry, true)
})

onUnmounted(() => {
  teardownReorder()
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', scheduleUpdateHoverGeometry, true)
  cancelAnimationFrame(canvasPointerRaf)
  cancelAnimationFrame(hoverGeomRaf)
  hoverResizeObserver?.disconnect()
  hoverResizeObserver = null
})

watch(
  () => [hoveredDesignerId.value, editorStore.currentElement, components.value] as const,
  () => scheduleUpdateHoverGeometry(),
  { deep: true }
)

watch(
  () => canvasRootRef.value,
  (el) => {
    hoverResizeObserver?.disconnect()
    hoverResizeObserver = null
    if (!el) return
    hoverResizeObserver = new ResizeObserver(scheduleUpdateHoverGeometry)
    hoverResizeObserver.observe(el)
  },
  { immediate: true }
)

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

/* 仅盖住当前悬停的表单项，虚线提示 + 拦截指针；选中同一项时透明但仍拦截（由上层选中框负责视觉） */
.designer-hover-sheet {
  border-radius: 2px;
  border: 1px dashed #409eff;
  background: rgba(64, 158, 255, 0.05);
  cursor: grab;
  touch-action: none;
  user-select: none;
  will-change: transform;
}

.designer-hover-sheet--same-selection {
  opacity: 0;
  border-color: transparent;
  background: transparent;
}

.designer-hover-sheet:active {
  cursor: grabbing;
}

/* 与 DesignerSelectionOverlay 内原样式一致，由 composable 驱动 */
.designer-reorder-drop-line {
  position: fixed;
  background-color: #1890ff;
  z-index: 10000;
  pointer-events: none;
  box-shadow: 0 0 4px rgba(24, 144, 255, 0.6);
}

.designer-reorder-drop-line--vertical {
  height: 2px;
}

.designer-reorder-drop-line--horizontal {
  width: 2px;
  height: 40px;
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
