<template>
  <div class="designer-aux-root" aria-hidden="true">
    <div v-show="visible" class="designer-selection-box" :style="boxStyle">
      <div class="designer-selection-box-inner" />
    </div>
    <div
      v-show="visible"
      class="designer-item-drag-sheet"
      :style="dragSheetStyle"
      title="按住拖动排序"
      @pointerdown.stop="emitReorderStart"
    />
    <div v-show="visible" class="designer-helpers" :style="helpersStyle">
      <span class="designer-helpers-drag" title="拖动排序" @pointerdown.stop="emitReorderStart" />
      <span class="designer-helpers-label">{{ label }}</span>
      <el-button size="small" type="primary" link @click.stop="onCopy">复制</el-button>
      <el-button size="small" type="danger" link @click.stop="onDelete">删除</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import useEditorStore from '@/store/modules/editor'

const props = defineProps<{
  rootEl: HTMLElement | null | undefined
}>()

const emit = defineEmits<{
  reorderPointerdown: [{ e: PointerEvent; captureEl: HTMLElement; fromIndex: number }]
}>()

const editorStore = useEditorStore()
const currentElement = computed(() => editorStore.currentElement)
const components = computed(() => editorStore.components)

const boxStyle = ref<Record<string, string>>({})
const dragSheetStyle = ref<Record<string, string>>({})
const helpersStyle = ref<Record<string, string>>({})

const visible = computed(
  () => !!currentElement.value && components.value.some((c) => c.name === currentElement.value)
)

const label = computed(() => {
  const cur = components.value.find((c) => c.name === currentElement.value)
  return (cur as { title?: string } | undefined)?.title || '表单项'
})

function emitReorderStart(e: PointerEvent) {
  const id = currentElement.value
  const from = components.value.findIndex((c) => c.name === id)
  if (from < 0) return
  emit('reorderPointerdown', {
    e,
    captureEl: e.currentTarget as HTMLElement,
    fromIndex: from
  })
}

function updateGeometry() {
  const root = props.rootEl
  const id = currentElement.value
  if (!root || !id) {
    boxStyle.value = {}
    dragSheetStyle.value = {}
    helpersStyle.value = {}
    return
  }

  const el = root.querySelector(`[data-designer-node-id="${id}"]`) as HTMLElement | null
  if (!el) {
    boxStyle.value = {}
    dragSheetStyle.value = {}
    helpersStyle.value = {}
    return
  }

  const cr = root.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  const left = r.left - cr.left + root.scrollLeft
  const top = r.top - cr.top + root.scrollTop

  const frame = {
    position: 'absolute',
    left: '0',
    top: '0',
    width: `${r.width}px`,
    height: `${r.height}px`,
    transform: `translate3d(${left}px, ${top}px, 0)`,
    zIndex: '20',
    boxSizing: 'border-box' as const
  }

  boxStyle.value = {
    ...frame,
    pointerEvents: 'none'
  }

  dragSheetStyle.value = {
    ...frame,
    pointerEvents: 'auto'
  }

  helpersStyle.value = {
    position: 'absolute',
    left: '0',
    top: '0',
    transform: `translate3d(${left + r.width}px, ${top}px, 0) translateX(-100%)`,
    pointerEvents: 'auto',
    zIndex: '21',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 6px',
    background: '#409eff',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    boxShadow: '0 1px 4px rgba(0,0,0,.12)'
  }
}

let raf = 0
let resizeObserver: ResizeObserver | null = null

function scheduleUpdate() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    nextTick(updateGeometry)
  })
}

function onCopy() {
  editorStore.copyComponents()
  scheduleUpdate()
}

function onDelete() {
  editorStore.deleteComponents()
  scheduleUpdate()
}

onMounted(() => {
  window.addEventListener('resize', scheduleUpdate, { passive: true })
  window.addEventListener('scroll', scheduleUpdate, true)
})

onUnmounted(() => {
  window.removeEventListener('resize', scheduleUpdate)
  window.removeEventListener('scroll', scheduleUpdate, true)
  cancelAnimationFrame(raf)
  resizeObserver?.disconnect()
  resizeObserver = null
})

watch(
  () => [currentElement.value, props.rootEl, components.value] as const,
  () => scheduleUpdate(),
  { deep: true }
)

watch(
  () => props.rootEl,
  (el) => {
    resizeObserver?.disconnect()
    resizeObserver = null
    if (!el) return
    resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(el)
  },
  { immediate: true }
)
</script>

<style scoped>
.designer-aux-root {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

.designer-selection-box {
  will-change: transform;
}

.designer-selection-box-inner {
  position: absolute;
  inset: 0;
  border: 1px solid #409eff;
  border-radius: 2px;
  background: rgba(64, 158, 255, 0.06);
  pointer-events: none;
}

.designer-item-drag-sheet {
  cursor: grab;
  touch-action: none;
  will-change: transform;
  background: transparent;
}

.designer-item-drag-sheet:active {
  cursor: grabbing;
}

.designer-helpers-drag {
  flex-shrink: 0;
  width: 10px;
  height: 14px;
  margin-right: 2px;
  cursor: grab;
  touch-action: none;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.92) 0 2px,
    transparent 2px 4px
  );
  border-radius: 1px;
}

.designer-helpers-drag:active {
  cursor: grabbing;
}

.designer-helpers-label {
  margin-right: 4px;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.designer-helpers :deep(.el-button.is-link) {
  color: rgba(255, 255, 255, 0.95) !important;
  padding: 0 4px;
  height: auto;
  font-size: 12px;
}

.designer-helpers :deep(.el-button.is-link:hover) {
  color: #fff !important;
}

.designer-helpers :deep(.el-button.is-link.el-button--danger) {
  color: #ffccc7 !important;
}

.designer-helpers :deep(.el-button.is-link.el-button--danger:hover) {
  color: #fff5f5 !important;
}
</style>
