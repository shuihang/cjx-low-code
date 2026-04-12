// 当前正在执行的 effect
export let activeEffect: ReactiveEffect | null = null
// 是否应该收集依赖
let shouldTrack = true

/**
 * 暂停依赖收集
 */
export function pauseTracking() {
  shouldTrack = false
}

/**
 * 恢复依赖收集
 */
export function resetTracking() {
  shouldTrack = true
}

/**
 * 依赖收集栈，用于处理嵌套 effect
 */
export const effectStack: ReactiveEffect[] = []

export interface ReactiveEffectOptions {
  scheduler?: (effect: () => void) => void
  name?: string
}

export class ReactiveEffect {
  active = true
  deps: Set<Set<ReactiveEffect>> = new Set()

  constructor(
    public fn: () => void,
    public scheduler?: (effect: () => void) => void,
    public name = 'effect'
  ) {}

  run() {
    if (!this.active) {
      return this.fn()
    }

    // 如果已在栈中，直接执行函数（不重复收集依赖，防止无限递归）
    if (effectStack.includes(this)) {
      return this.fn()
    }

    // 清理旧的依赖
    this.cleanup()

    try {
      effectStack.push(this)
      activeEffect = this as ReactiveEffect
      return this.fn()
    } finally {
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1] || null
    }
  }

  cleanup() {
    this.deps.forEach((depSet) => {
      depSet.delete(this)
    })
    this.deps.clear()
  }

  stop() {
    if (this.active) {
      this.cleanup()
      this.active = false
    }
  }
}

export function effect(fn: () => void, options?: ReactiveEffectOptions) {
  const _effect = new ReactiveEffect(fn, options?.scheduler, options?.name || 'effect')
  _effect.run()
  return _effect
}

/**
 * 停止一个 effect，使其不再响应依赖变化
 */
export function stop(effect: ReactiveEffect) {
  effect.stop()
}

// 存储所有依赖关系：target -> key -> Set<effect>
const targetMap = new WeakMap<object, Map<string | symbol, Set<ReactiveEffect>>>()

export const track = (target: object, type: string, key: string | symbol) => {
  if (!shouldTrack || !activeEffect) {
    return
  }

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let depSet = depsMap.get(key)
  if (!depSet) {
    depSet = new Set()
    depsMap.set(key, depSet)
  }

  if (!depSet.has(activeEffect)) {
    depSet.add(activeEffect)
    // 双向收集，用于 cleanup
    activeEffect.deps.add(depSet)
  }
}

export const trigger = (target: object, type: string, key: string | symbol) => {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }

  const depSet = depsMap.get(key)
  if (depSet) {
    // 复制一份，避免在遍历过程中修改原集合
    const effects = new Set(depSet)
    effects.forEach((effect) => {
      if (effect !== activeEffect) {
        if (effect.scheduler) {
          effect.scheduler(effect.run.bind(effect))
        } else {
          effect.run()
        }
      }
    })
  }
}

// 用于 Tracker 的批量更新
let batchDepth = 0
const batchedEffects = new Set<ReactiveEffect>()

export function batchStart() {
  batchDepth++
}

export function batchEnd() {
  batchDepth--
  if (batchDepth === 0) {
    // 批量执行所有待更新的 effect
    const effects = new Set(batchedEffects)
    batchedEffects.clear()
    effects.forEach((effect) => {
      if (effect.scheduler) {
        effect.scheduler(effect.run.bind(effect))
      } else {
        effect.run()
      }
    })
  }
}

// 添加 effect 到批量队列
export function queueEffect(effect: ReactiveEffect) {
  if (batchDepth > 0) {
    batchedEffects.add(effect)
  } else {
    if (effect.scheduler) {
      effect.scheduler(effect.run.bind(effect))
    } else {
      effect.run()
    }
  }
}

/**
 * 批量更新函数
 * 在 batch 函数内触发的更新会被合并，直到 batch 结束才执行
 */
export function batch<T>(fn: () => T): T {
  batchStart()
  try {
    return fn()
  } finally {
    batchEnd()
  }
}

// 释放绑定的 reactions（用于 cleanup）
export function releaseBindingReactions(effect: ReactiveEffect) {
  effect.cleanup()
}

// 释放 effect 的所有依赖
export function disposeBindingReactions(effect: ReactiveEffect) {
  effect.stop()
}
