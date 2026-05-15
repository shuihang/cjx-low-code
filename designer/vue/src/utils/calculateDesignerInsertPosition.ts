/**
 * 根据画布内带 data-designer-node-id 的表单项 DOM 顺序，计算拖入插入下标。
 * 与 DropZone 中 designSchema 打标方式一致。
 */
export type DesignerInsertType = 'vertical' | 'horizontal'

export interface DesignerInsertHit {
  insertIndex: number
  insertY: number
  insertX: number
  type: DesignerInsertType
}

/** 将 calculateDesignerInsertPosition 的 insertIndex 转为 moveComponents 的 toIndex（先移除 from 再插入） */
export function reorderInsertIndexToMoveTarget(fromIndex: number, insertIndex: number): number {
  let to = insertIndex
  if (fromIndex < to) to -= 1
  return to
}

const DESIGNER_NODE = '[data-designer-node-id]'

export function calculateDesignerInsertPosition(
  canvasArea: HTMLElement,
  clientX: number,
  clientY: number
): DesignerInsertHit {
  const canvasRect = canvasArea.getBoundingClientRect()
  const existingItems = Array.from(canvasArea.querySelectorAll(DESIGNER_NODE)) as HTMLElement[]

  if (existingItems.length === 0) {
    return { insertIndex: 0, insertY: canvasRect.top, insertX: canvasRect.left, type: 'vertical' }
  }

  const relativeX = clientX - canvasRect.left
  const relativeY = clientY - canvasRect.top

  for (const [i, existingItem] of existingItems.entries()) {
    const itemRect = existingItem.getBoundingClientRect()
    const itemRelativeTop = itemRect.top - canvasRect.top
    const itemRelativeBottom = itemRect.bottom - canvasRect.top
    const itemRelativeLeft = itemRect.left - canvasRect.left
    const itemRelativeRight = itemRect.right - canvasRect.left

    const itemMiddleY = (itemRelativeTop + itemRelativeBottom) / 2
    const itemMiddleX = (itemRelativeLeft + itemRelativeRight) / 2

    const isInItemY = relativeY >= itemRelativeTop && relativeY <= itemRelativeBottom
    const isInItemX = relativeX >= itemRelativeLeft && relativeX <= itemRelativeRight

    if (isInItemY && isInItemX) {
      if (relativeX <= itemMiddleX) {
        return {
          insertIndex: i,
          insertY: itemRect.top,
          insertX: itemRect.left,
          type: 'horizontal'
        }
      }
      return {
        insertIndex: i + 1,
        insertY: itemRect.top,
        insertX: itemRect.right,
        type: 'horizontal'
      }
    }
    if (isInItemY) {
      if (relativeX <= itemRelativeLeft) {
        return {
          insertIndex: i,
          insertY: itemRect.top,
          insertX: itemRect.left,
          type: 'horizontal'
        }
      }
      if (relativeX >= itemRelativeRight) {
        return {
          insertIndex: i + 1,
          insertY: itemRect.top,
          insertX: itemRect.right,
          type: 'horizontal'
        }
      }
    } else if (relativeY <= itemMiddleY) {
      return {
        insertIndex: i,
        insertY: itemRect.top,
        insertX: itemRect.left,
        type: 'vertical'
      }
    }
  }

  const lastItem = existingItems[existingItems.length - 1]
  const lastItemRect = lastItem.getBoundingClientRect()
  return {
    insertIndex: existingItems.length,
    insertY: lastItemRect.bottom,
    insertX: lastItemRect.left,
    type: 'vertical'
  }
}
