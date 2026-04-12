import { useCallback, useRef, useState } from 'react'

const EMPTY_ARRAY: any[] = []
const RENDER_COUNT = { value: 0 }
const RENDER_QUEUE = new Set<() => void>()

export function useForceUpdate() {
  const [, setState] = useState([])

  const update = useCallback(() => {
    setState([])
  }, EMPTY_ARRAY)

  const scheduler = useCallback(() => {
    if (RENDER_COUNT.value === 0) {
      update()
    } else {
      RENDER_QUEUE.add(update)
    }
  }, EMPTY_ARRAY)

  return scheduler
}
