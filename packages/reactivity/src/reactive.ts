import { currentReaction } from './reaction'
import { ObservableFlags } from './constants'
import type { Reaction } from './reaction'
import type { Target } from './observable'

// 存储所有响应式对象的 WeakMap
// key: 原始对象 -> value: 该对象的属性依赖 Map
export const observableMap = new WeakMap<object, Map<PropertyKey, Set<Reaction>>>()

/**
 * 创建 Observable 对象的 Proxy Handler
 */
function createObservableHandler<T extends object>(target: T): ProxyHandler<T> {
  return {
    get(target, key, receiver) {
      if (key === ObservableFlags.IS_OBSERVABLE) {
        // 当你访问 __v_isObservable 属性时，返回是否响应式
        return true
      }

      const value = Reflect.get(target, key, receiver)
      // console.log('get ------', key, currentReaction)
      // 如果有正在执行的 Reaction，建立依赖关系
      if (currentReaction) {
        // 获取或创建该对象的属性依赖 Map
        let propsMap = observableMap.get(target)
        if (!propsMap) {
          propsMap = new Map()
          observableMap.set(target, propsMap)
        }

        // 获取或创建该属性的 Reaction 集合
        let reactions = propsMap.get(key)
        if (!reactions) {
          reactions = new Set()
          // console.log('create reactions', key)
          propsMap.set(key, reactions)
        }

        // 建立双向依赖关系
        currentReaction.addDependency(reactions)
      }

      // 如果值是对象，递归将其转为响应式
      if (typeof value === 'object' && value !== null && !isObservable(value)) {
        return observable(value)
      }

      return value
    },

    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver)
      const result = Reflect.set(target, key, value, receiver)

      // 值发生变化时，触发依赖更新
      if (oldValue !== value) {
        trigger(target, key)
      }

      return result
    },

    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key)
      trigger(target, key)
      return result
    }
  }
}

/**
 * 触发目标对象属性的更新
 */
function trigger(target: object, key: PropertyKey): void {
  const propsMap = observableMap.get(target)
  if (!propsMap) return

  const reactions = propsMap.get(key)
  if (reactions) {
    // 复制一份，防止在 notify 过程中集合被修改
    ;[...reactions].forEach((reaction) => reaction.notify())
  }
}

// 标记 Observable 对象的 Symbol
const OBSERVABLE_SYMBOL = Symbol('observable')

const testFlag = false

/**
 * 将普通对象转换为响应式对象
 */
export function observable<T extends object>(target: T): T {
  // 已经是响应式对象，直接返回
  if (isObservable(target)) return target

  // const existingProxy = observableMap.get(target)
  // console.log('existingProxy', target, existingProxy)
  // if (target.name === 'gg') {
  //   if (testFlag) {
  //     return target
  //   }
  //   testFlag = true
  // }
  // if (existingProxy) {
  //   console.log('existingProxy', target, observableMap)
  //   return existingProxy
  // }

  // if (target[ObservableFlags.IS_OBSERVABLE] && target[ObservableFlags.RAW]) {
  //   // 判断是否是代理对象 observable(observable(target)) 防止嵌套代理
  //   return target
  // }

  const proxy = new Proxy(target, createObservableHandler(target))

  // 标记为响应式对象
  Object.defineProperty(proxy, OBSERVABLE_SYMBOL, {
    value: true,
    enumerable: false,
    configurable: false
  })

  return proxy
}

/**
 * 判断对象是否为响应式对象
 */
export function isObservable(obj: unknown): obj is object {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (obj as { [OBSERVABLE_SYMBOL]?: boolean })[OBSERVABLE_SYMBOL] === true
  )
}

// export function isObservable(value: any) {
//   return !!(value && (value as Target)[ObservableFlags.IS_OBSERVABLE])
// }
