import { isFunction } from '@cjx-low-code/shared'
import {
  ReactiveEffect,
  batchEnd,
  batchStart,
  effectStack,
  releaseBindingReactions
} from './effect_c'
import type { ReactiveEffectOptions } from './effect_c'

export interface Reaction {
  (): any
  _scheduler?: (callback: () => void) => void
  _name?: string
  _boundary?: number
}

export class Tracker {
  private results: any
  private effect: ReactiveEffect | null = null
  private disposed = false

  constructor(scheduler?: (fn: () => void) => void, name = 'TrackerReaction') {
    this.effect = new ReactiveEffect(() => ({}), scheduler, name)
  }

  track<T>(tracker: () => T): T {
    if (!isFunction(tracker)) {
      return this.results
    }

    if (this.disposed) {
      console.warn('Tracker has been disposed')
      return this.results
    }

    // 避免重复追踪
    if (effectStack.includes(this.effect!)) {
      return this.results
    }

    // 清理旧的依赖
    this.effect!.cleanup()

    try {
      batchStart()
      effectStack.push(this.effect!)

      // 替换 effect 的执行函数
      const originalFn = this.effect!.fn
      this.effect!.fn = tracker
      this.results = this.effect!.run()
      this.effect!.fn = originalFn
    } finally {
      effectStack.pop()
      batchEnd()
    }

    return this.results
  }

  dispose() {
    if (this.effect) {
      this.effect.stop()
      this.effect = null
      this.disposed = true
    }
  }
}

// 创建追踪器的工厂函数
export function createTracker(scheduler?: (fn: () => void) => void, name?: string) {
  return new Tracker(scheduler, name)
}
