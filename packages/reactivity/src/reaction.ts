import { observableMap } from './reactive'
// 全局变量：当前正在执行的观察者
export let currentReaction: Reaction | null = null

setTimeout(() => {
  console.log('observableMap', observableMap)
})

/**
 * Reaction 类 - 观察者/响应式副作用
 * 当依赖的数据变化时，会触发 onInvalidate 回调
 */
export class Reaction {
  private onInvalidate: () => void
  private disposed = false
  // 记录当前 Reaction 依赖的所有依赖集合，用于清理
  private dependencies: Set<Set<Reaction>> = new Set()

  constructor(onInvalidate: () => void) {
    this.onInvalidate = onInvalidate
  }

  /**
   * 追踪依赖
   * 在执行 fn 前调用，设置 currentReaction 以便收集依赖
   */
  track<T>(fn: () => T): T {
    if (this.disposed) return fn()

    // 保存之前的 reaction，防止嵌套
    const prevReaction = currentReaction
    currentReaction = this as Reaction

    // 清理之前的依赖关系
    this.cleanup()

    try {
      return fn()
    } finally {
      // 恢复之前的 reaction
      currentReaction = prevReaction
    }
  }

  /**
   * 添加依赖关系
   * 被 ObservableHandler 调用
   */
  addDependency(dep: Set<Reaction>): void {
    if (!this.dependencies.has(dep)) {
      this.dependencies.add(dep)
      dep.add(this)
    }
  }

  /**
   * 清理所有依赖关系
   */
  cleanup(): void {
    this.dependencies.forEach((dep) => {
      dep.delete(this)
    })
    this.dependencies.clear()
  }

  /**
   * 通知响应式更新
   */
  notify(): void {
    if (!this.disposed) {
      this.onInvalidate()
    }
  }

  /**
   * 销毁 Reaction
   */
  dispose(): void {
    this.cleanup()
    this.disposed = true
  }
}

/**
 * 创建响应式计算值
 * 类似于 Vue 的 computed
 */
export function autorun(fn: () => void): () => void {
  const reaction = new Reaction(() => {
    reaction.track(fn)
  })

  // 首次执行，收集依赖
  reaction.track(fn)

  // 返回清理函数
  return () => reaction.dispose()
}

/**
 * 批量更新，优化性能
 * 在 batch 函数内触发的更新会被合并
 */
let batching = false
const pendingReactions: Set<Reaction> = new Set()

export function batch<T>(fn: () => T): T {
  if (batching) {
    return fn()
  }

  batching = true
  try {
    return fn()
  } finally {
    batching = false
    // 执行所有待处理的响应
    pendingReactions.forEach((reaction) => reaction.notify())
    pendingReactions.clear()
  }
}

// 添加 bound 方法，用于绑定 this 上下文
batch.bound = function <T extends (...args: any[]) => any>(
  this: any,
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  const context = this as any
  return function (...args: Parameters<T>): ReturnType<T> {
    return batch(() => {
      return fn.apply(context, args)
    })
  }
}

/**
 * 创建响应式副作用（类似于 MobX 的 reaction）
 * @param tracker - 追踪函数，返回值用于判断是否需要执行 effect
 * @param effect - 副作用函数，当 tracker 返回值变化时执行
 * @returns 清理函数
 */
export function reaction<T>(
  tracker: () => T,
  effect: (value: T, prevValue: T | undefined) => void
): () => void {
  let oldValue: T | undefined
  let disposed = false

  const r = new Reaction(() => {
    if (disposed) return

    const newValue = r.track(tracker)

    // 只有当值发生变化时才执行 effect
    if (newValue !== oldValue) {
      effect(newValue, oldValue)
      oldValue = newValue
    }
  })

  // 首次执行，收集依赖
  oldValue = r.track(tracker)

  return () => {
    disposed = true
    r.dispose()
  }
}

/**
 * 延迟执行响应（用于 batch）
 */
export function queueReaction(reaction: Reaction): void {
  if (batching) {
    pendingReactions.add(reaction)
  } else {
    reaction.notify()
  }
}
