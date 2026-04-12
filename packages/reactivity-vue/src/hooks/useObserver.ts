import { getCurrentInstance, onBeforeUnmount } from 'vue'
import { isFunction } from '@cjx-low-code/shared'
import { Reaction } from '@cjx-low-code/reactivity'
import type { IObserverOptions } from '../types'

/**
 * useObserver
 * 用于将 Vue 组件转换为响应式组件 通知Vue更新组件 同步Field的状态
 */
export const useObserver = (options?: IObserverOptions) => {
  const vm = getCurrentInstance()
  if (!vm) return

  let tracker: Reaction | null = null
  const disposeTracker = () => {
    if (tracker) {
      tracker.dispose()
      tracker = null
    }
  }
  const vmUpdate = () => {
    vm?.proxy?.$forceUpdate()
  }

  onBeforeUnmount(disposeTracker)

  Object.defineProperty(vm, 'effect', {
    get() {
      return vm['_updateEffect'] || {}
    },
    set(newValue) {
      vm['_updateEffectRun'] = newValue.run
      disposeTracker()
      const newTracker = () => {
        tracker = new Reaction(() => {
          if (options?.scheduler && isFunction(options.scheduler)) {
            options.scheduler(vmUpdate)
          } else {
            vmUpdate()
          }
        })
      }

      const update = function () {
        let refn = null
        // console.log('update', newValue)
        refn = vm['_updateEffectRun'].call(newValue)
        tracker?.track(() => {
          refn = vm['_updateEffectRun'].call(newValue)
        })
        return refn
      }
      newTracker()
      newValue.run = update
      vm['_updateEffect'] = newValue
    }
  })
}
