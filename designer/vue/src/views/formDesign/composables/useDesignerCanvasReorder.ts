import { reactive } from 'vue'
import {
  calculateDesignerInsertPosition,
  reorderInsertIndexToMoveTarget
} from '@/utils/calculateDesignerInsertPosition'

const DRAG_THRESHOLD_PX = 5
const GHOST_OFFSET = 12

export interface UseDesignerCanvasReorderOptions {
  /** 画布内排序时，跟随指针显示的文案（一般为表单项 title） */
  getGhostLabel?: (fromIndex: number) => string | null | undefined
}

export function useDesignerCanvasReorder(
  getCanvasArea: () => HTMLElement | null,
  moveComponents: (fromIndex: number, toIndex: number) => void,
  getComponentCount: () => number,
  options?: UseDesignerCanvasReorderOptions
) {
  const reorderDrop = reactive({
    show: false,
    style: {} as Record<string, string>,
    type: 'vertical' as 'vertical' | 'horizontal'
  })

  let pendingReorderInsertIndex = 0
  let reorderFromIndex = -1
  let reorderPointerActive = false
  let reorderCaptureEl: HTMLElement | null = null
  let reorderPointerId = -1
  let pointerStartX = 0
  let pointerStartY = 0
  let maxDragDistance = 0
  let pendingGhostLabel = ''
  let ghostEl: HTMLElement | null = null

  function removeGhost() {
    if (ghostEl?.parentNode) {
      ghostEl.parentNode.removeChild(ghostEl)
    }
    ghostEl = null
  }

  function createGhost(label: string, clientX: number, clientY: number) {
    removeGhost()
    const el = document.createElement('div')
    el.className = 'designer-reorder-ghost'
    el.textContent = label
    el.setAttribute('role', 'presentation')
    Object.assign(el.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      zIndex: '10001',
      pointerEvents: 'none',
      padding: '6px 12px',
      borderRadius: '6px',
      background: 'rgba(64, 158, 255, 0.95)',
      color: '#fff',
      fontSize: '13px',
      fontWeight: '500',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.18)',
      whiteSpace: 'nowrap',
      maxWidth: 'min(280px, calc(100vw - 24px))',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      transform: `translate3d(${clientX + GHOST_OFFSET}px, ${clientY + GHOST_OFFSET}px, 0)`,
      willChange: 'transform'
    })
    document.body.appendChild(el)
    ghostEl = el
  }

  function updateGhostPosition(clientX: number, clientY: number) {
    if (!ghostEl) return
    ghostEl.style.transform = `translate3d(${clientX + GHOST_OFFSET}px, ${
      clientY + GHOST_OFFSET
    }px, 0)`
  }

  function updateReorderIndicator(clientX: number, clientY: number) {
    const area = getCanvasArea()
    if (!area) {
      reorderDrop.show = false
      return
    }
    const { insertY, insertX, type, insertIndex } = calculateDesignerInsertPosition(
      area,
      clientX,
      clientY
    )
    pendingReorderInsertIndex = insertIndex
    const canvasRect = area.getBoundingClientRect()
    reorderDrop.show = true
    reorderDrop.type = type
    if (type === 'vertical') {
      reorderDrop.style = {
        position: 'fixed',
        left: `${canvasRect.left}px`,
        right: `${window.innerWidth - canvasRect.right}px`,
        top: `${insertY}px`,
        height: '2px',
        backgroundColor: '#1890ff',
        zIndex: '10000',
        pointerEvents: 'none',
        boxShadow: '0 0 4px rgba(24, 144, 255, 0.6)'
      }
    } else {
      reorderDrop.style = {
        position: 'fixed',
        left: `${insertX}px`,
        top: `${insertY}px`,
        width: '2px',
        height: '40px',
        backgroundColor: '#1890ff',
        zIndex: '10000',
        pointerEvents: 'none',
        boxShadow: '0 0 4px rgba(24, 144, 255, 0.6)'
      }
    }
  }

  function onReorderPointerMove(e: PointerEvent) {
    if (!reorderPointerActive) return
    maxDragDistance = Math.max(
      maxDragDistance,
      Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY)
    )
    if (maxDragDistance >= DRAG_THRESHOLD_PX) {
      if (pendingGhostLabel && !ghostEl) {
        createGhost(pendingGhostLabel, e.clientX, e.clientY)
      }
      updateGhostPosition(e.clientX, e.clientY)
      updateReorderIndicator(e.clientX, e.clientY)
    } else {
      reorderDrop.show = false
      removeGhost()
    }
  }

  function teardownReorder() {
    removeGhost()
    pendingGhostLabel = ''
    reorderPointerActive = false
    reorderDrop.show = false
    document.body.style.cursor = ''
    document.removeEventListener('pointermove', onReorderPointerMove)
    document.removeEventListener('pointerup', onReorderPointerUp)
    document.removeEventListener('pointercancel', onReorderPointerUp)
    if (reorderCaptureEl && reorderPointerId >= 0) {
      try {
        if (reorderCaptureEl.hasPointerCapture(reorderPointerId)) {
          reorderCaptureEl.releasePointerCapture(reorderPointerId)
        }
      } catch {
        /* ignore */
      }
    }
    reorderCaptureEl = null
    reorderPointerId = -1
  }

  function onReorderPointerUp() {
    if (!reorderPointerActive) return
    const from = reorderFromIndex
    const insertIndex = pendingReorderInsertIndex
    const didDrag = maxDragDistance >= DRAG_THRESHOLD_PX
    teardownReorder()
    reorderFromIndex = -1

    if (!didDrag || from < 0) return
    const n = getComponentCount()
    const to = reorderInsertIndexToMoveTarget(from, insertIndex)
    if (to !== from && to >= 0 && to < n) {
      moveComponents(from, to)
    }
  }

  function startReorder(e: PointerEvent, captureEl: HTMLElement, fromIndex: number) {
    if (e.button !== 0) return
    if (fromIndex < 0) return

    e.preventDefault()
    reorderFromIndex = fromIndex
    pendingReorderInsertIndex = fromIndex
    reorderPointerActive = true
    pointerStartX = e.clientX
    pointerStartY = e.clientY
    maxDragDistance = 0
    reorderCaptureEl = captureEl
    reorderPointerId = e.pointerId
    pendingGhostLabel = (options?.getGhostLabel?.(fromIndex) ?? '').trim()

    try {
      captureEl.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }

    document.body.style.cursor = 'grabbing'
    document.addEventListener('pointermove', onReorderPointerMove)
    document.addEventListener('pointerup', onReorderPointerUp)
    document.addEventListener('pointercancel', onReorderPointerUp)
  }

  return {
    reorderDrop,
    startReorder,
    teardownReorder
  }
}
