<template>
  <div
    ref="editWrapper"
    class="edit-wrapper"
    :class="{ active: currentElement === props.id }"
    :style="styles"
    @click="onSetActive(props.id)"
    @mousedown="startMove"
  >
    <slot />

    <div class="resizer">
      <div class="resizer-item top-left" @mousedown.stop="startResize('top-left')" />

      <div class="resizer-item top-right" @mousedown.stop="startResize('top-right')" />

      <div class="resizer-item bottom-right" @mousedown.stop="startResize('bottom-right')" />

      <div class="resizer-item bottom-left" @mousedown.stop="startResize('bottom-left')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { pick } from 'lodash-es'
import useEditorStore from '../../store/module/editor'

import type { PartialTextComponentProps } from '../../hooks/useComponentCommon'

const { currentElement } = storeToRefs(useEditorStore())

interface Props {
  id: string
  props: PartialTextComponentProps
}

const props = withDefaults(defineProps<Props>(), {})

// const newProps = Object.keys(props.props).reduce(

const styles = ref<any>(pick(props.props, ['position', 'top', 'left', 'width', 'height']))

watch(props.props, (val) => {
  styles.value = pick(val, ['position', 'top', 'left', 'width', 'height'])
})

// console.log(styles)
const emit = defineEmits(['setActive', 'updatePosition'])

const onSetActive = (id: string) => {
  emit('setActive', id)
}

//
const editWrapper = ref<HTMLElement>()
const gap = {
  x: 0,
  y: 0
}
const isMouseDown = ref<boolean>(false)
// 计算
const calculateMovePosition = (e: MouseEvent) => {
  const canvasArea = document.querySelector('#canvas-area') as HTMLDivElement
  const left = e.clientX - gap.x - canvasArea.offsetLeft
  const top = e.clientY - gap.y - canvasArea.offsetTop
  return { left, top }
}
const startMove = (e: MouseEvent) => {
  isMouseDown.value = true
  const currentElement = editWrapper.value

  if (currentElement) {
    const { left, top } = currentElement.getBoundingClientRect()
    gap.x = e.clientX - left
    gap.y = e.clientY - top
    // console.log(gap)
  }

  // 鼠标移动
  const handleMouseMove = (e: MouseEvent) => {
    const { left, top } = calculateMovePosition(e)
    // console.log(left, top)
    if (currentElement) {
      currentElement.style.left = `${left}px`
      currentElement.style.top = `${top}px`
    }
  }

  // 鼠标松开
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMouseMove)
    if (isMouseDown.value) {
      const { left, top } = calculateMovePosition(e)
      // 更新最新坐标
      emit('updatePosition', { left, top, id: props.id })
      isMouseDown.value = false
    }
    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// bottom-right width = e.clientX- left / height = e.clientY - top
// bottom-left  width = right - e.clientX  / height = e.clientY - top  left =  e.clientX - container.left
// top-right  width = e.clientX- left / height = bottom - e.clientY  top = e.clientY - container.top
// top-left  width = right - e.clientX / height = bottom - e.clientY  top = e.clientY - container.top left = e.clientX - container.left

// 那个方向拉
type Direction = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
// 拉大
const calculateSizeShifting = (
  direction: Direction,
  e: MouseEvent,
  shifting: { left: number; top: number; right: number; bottom: number }
) => {
  const { clientX, clientY } = e
  const { left, top, right, bottom } = shifting
  const container = document.querySelector('#canvas-area') as HTMLDivElement
  // const rightWidth = clientX - left
  // const leftWidth = right - clientX
  // const bottomHeight = clientY - top
  // const topHeight = bottom - clientY
  const topOffset = clientY - container.offsetTop
  const leftOffset = clientX - container.offsetLeft
  switch (direction) {
    case 'bottom-right':
      return {
        width: clientX - left,
        height: clientY - top
      }
    case 'bottom-left':
      return {
        width: right - clientX,
        height: clientY - top,
        left: leftOffset
      }
    case 'top-right':
      return {
        width: clientX - left,
        height: bottom - clientY,
        top: topOffset
      }
    case 'top-left':
      return {
        width: right - clientX,
        height: bottom - clientY,
        top: topOffset,
        left: leftOffset
      }
    default:
      break
  }
}

const startResize = (direction: Direction) => {
  const currentElement = editWrapper.value as HTMLDataElement
  const { left, top, right, bottom } = currentElement.getBoundingClientRect()
  const handleMove = (e: MouseEvent) => {
    const size = calculateSizeShifting(direction, e, { left, top, right, bottom })
    const { style } = currentElement
    if (size) {
      style.width = `${size.width}px`
      style.height = `${size.height}px`
      if (size.left) {
        style.left = `${size.left}px`
      }
      if (size.top) {
        style.top = `${size.top}px`
      }
    }
    // console.log(currentElement.style.width)
  }
  // mouseup 是一个 JavaScript 事件，当用户在元素上松开鼠标按钮时触发。
  // 它通常用于处理用户释放鼠标按钮的功能，例如清除选中状态或执行某些操作
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMove)
    const size = calculateSizeShifting(direction, e, { left, top, right, bottom })
    emit('updatePosition', { ...size, id: props.id })
    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }

  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style lang="scss">
@import '../../theme/styles/mixin.scss';

.edit-wrapper {
  box-sizing: border-box;
  cursor: pointer;
  padding: 10px;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
}
.edit-wrapper > * {
  position: static !important;
}
.edit-wrapper.active .z-text-component {
  cursor: text;
}
.edit-wrapper.active {
  @include border_color;
  // border-width: 1px;
  // border-style: solid;
  z-index: 5;

  // padding: 5px;
  .resizer {
    display: block;
    .resizer-item {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #fff;
      @include border_color;
      border-width: 3px;
      border-style: solid;
      position: absolute;
    }
    .top-left {
      top: -5px;
      left: -5px;
      cursor: nwse-resize;
    }
    .top-right {
      top: -5px;
      right: -5px;
      cursor: nesw-resize;
    }
    .bottom-right {
      bottom: -5px;
      right: -5px;
      cursor: nwse-resize;
    }
    .bottom-left {
      bottom: -5px;
      left: -5px;
      cursor: nesw-resize;
    }
  }
}
</style>
