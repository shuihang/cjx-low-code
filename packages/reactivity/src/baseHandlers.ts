import { hasChanged, hasOwn, isArray, isObject, isSymbol, makeMap } from '@cjx-low-code/shared'
import { activeEffect, pauseTracking, resetTracking, track, trigger } from './effect_c'
import { ObservableFlags, TrackOpTypes, TriggerOpTypes } from './constants'
import { observable, observableMap, readonly, readonlyMap, toRaw } from './observable'
import { warn } from './warning'
import type { Target } from './observable'

// 用来表示对象迭代操作依赖的key
export const ITERATE_KEY = Symbol()

const isNonTrackableKeys = makeMap('__proto__')

const builtInSymbols = new Set(
  /*#__PURE__*/
  Object.getOwnPropertyNames(Symbol)
    // iOS 10.x 中，Object.getOwnPropertyNames(Symbol) 可以枚举 'arguments' 和 'caller'
    // 但在 Symbol 上访问它们会导致 TypeError，因为 Symbol 是一个严格模式
    // 函数
    .filter((key) => key !== 'arguments' && key !== 'caller')
    .map((key) => (Symbol as any)[key])
    .filter(isSymbol)
)

// 通过对象存储改动之后的数组方法，进行统一管理
const arrayInstrumentations: Record<string, (...args: unknown[]) => unknown> = {}

;['includes', 'indexOf', 'lastIndexOf'].forEach((key) => {
  const method = Array.prototype[key]
  arrayInstrumentations[key] = function (this: unknown[], ...args: unknown[]) {
    const arr = toRaw(this)

    for (let i = 0, len = args.length; i < len; i++) {
      track(arr, TrackOpTypes.GET, `${i}`)
    }
    const res = method.apply(arr, args)
    if (res === -1 || res === false) {
      // 如果在原始数组中没有找到，注意，还需要进行处理，因为参数可能是响应式
      return method.apply(arr, args.map(toRaw))
    }
    return res
  }
})
// 数组方法 重定向到 arrayInstrumentations 中的方法
;['push', 'pop', 'shift', 'unshift', 'splice'].forEach((key) => {
  const method = Array.prototype[key]
  arrayInstrumentations[key] = function (this: unknown[], ...args: unknown[]) {
    pauseTracking()
    const res = method.apply(this, args)
    resetTracking()
    return res
  }
})

class BaseObservableHandler implements ProxyHandler<Target> {
  constructor(
    protected readonly _isReadonly = false,
    protected readonly _isShallow = false
  ) {}

  get(target: Target, key: string | symbol, receiver: object) {
    const proxyMap = this._isReadonly ? readonlyMap : observableMap

    if (key === ObservableFlags.IS_OBSERVABLE) {
      // 当你访问 __v_isObservable 属性时，返回是否响应式
      return true
    } else if (key === ObservableFlags.IS_READONLY) {
      // 当你访问 __v_isReadonly 属性时，返回是否只读
      return this._isReadonly
    } else if (key === ObservableFlags.RAW && receiver === proxyMap.get(target)) {
      // key === ObservableFlags.RAW 当你访问 __v_raw 属性时 并且接收者（receiver）就是这个响应式代理本身 就返回原始对象
      // 只有当 receiver 就是当前响应式代理本身时，才返回原始对象
      // 防止通过原型链继承的对象获取原始对象
      // 例如：Object.create(proxy).__v_raw 不应该返回原始对象
      return target
    }

    const result = Reflect.get(target, key, receiver)

    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return result
    }

    const targetIsArray = isArray(target)
    if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
      // 数组方法 重定向到 arrayInstrumentations 中的方法
      return Reflect.get(arrayInstrumentations, key, receiver)
    }

    if (!this._isReadonly) {
      // 只有非只读才进行依赖收集
      track(target, TrackOpTypes.GET, key)
    }

    if (this._isShallow) {
      // 如果是浅层代理就不递归响应式处理子对象
      return result
    }

    if (isObject(result)) {
      // 递归响应式处理子对象
      return this._isReadonly ? readonly(result) : observable(result)
    }

    return result
  }
}

class MutableObservableHandler extends BaseObservableHandler {
  constructor(isShallow = false) {
    super(false, isShallow)
  }

  set(target: Record<string | symbol, unknown>, key: string | symbol, value: any, receiver) {
    // 检查属性是否存在

    const type = hasOwn(target, key) ? TriggerOpTypes.SET : TriggerOpTypes.ADD

    // 如果数组获取长度,获取旧的长度
    const oldLength = isArray(target) ? target.length : 0

    const oldValue = target[key]

    const result = Reflect.set(target, key, value, receiver)
    if (!result) {
      return result
    }
    // 获取新的长度
    const newLength = isArray(target) ? target.length : 0

    if (hasChanged(value, oldValue) || type === TriggerOpTypes.ADD) {
      trigger(target, type, key)
      if (isArray(target) && newLength !== oldLength) {
        if (key !== 'length') {
          // 数组长度改变 且不是 length 属性 触发set操作 并更新 length 属性 例如：[1, 2, 3, 4, 5][10] = 99 会触发 set 操作 并更新 length 属性为 11
          trigger(target, TriggerOpTypes.SET, 'length')
        } else {
          for (let i = newLength; i < oldLength; i++) {
            // 数组长度改变 且是 length 属性 触发delete操作 并删除超出范围的元素 例如：[1, 2, 3, 4, 5].length = 3 会触发 delete 操作 并删除超出范围的元素
            trigger(target, TriggerOpTypes.DELETE, `${i}`)
          }
        }
      }
    }

    return result
  }

  // 处理 in 操作符
  has(target: Record<string | symbol, unknown>, key: string | symbol) {
    track(target, TrackOpTypes.HAS, key)

    const result = Reflect.has(target, key)
    return result
  }

  // 处理迭代操作 for of 循环 for in 循环 等场景
  ownKeys(target: Record<string | symbol, unknown>): (string | symbol)[] {
    track(target, TrackOpTypes.ITERATE, ITERATE_KEY)
    const result = Reflect.ownKeys(target)
    return result
  }
  deleteProperty(target: Record<string | symbol, unknown>, key: string | symbol) {
    // 检查属性是否存在
    const hadKey = hasOwn(target, key)
    const result = Reflect.deleteProperty(target, key)
    if (hadKey && result) {
      // 属性存在 删除属性 触发 delete 操作
      trigger(target, TriggerOpTypes.DELETE, key)
    }

    return result
  }
}

class ReadonlyObservableHandler extends BaseObservableHandler {
  constructor(isShallow = false) {
    super(true, isShallow)
  }
  set(target: object, key: string | symbol) {
    warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target)

    return true
  }

  deleteProperty(target: object, key: string | symbol) {
    warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target)

    return true
  }
}

export const mutableHandlers: ProxyHandler<object> = /*#__PURE__*/ new MutableObservableHandler()

export const shallowObservableHandlers = /*#__PURE__*/ new MutableObservableHandler(true)

export const readonlyHandlers: ProxyHandler<object> = /*#__PURE__*/ new ReadonlyObservableHandler()
