import { isObject } from '@cjx-low-code/shared'
import { mutableHandlers, readonlyHandlers, shallowObservableHandlers } from './baseHandlers'
import { ObservableFlags } from './constants'
import type { Reaction } from './reaction'

export interface Target {
  [ObservableFlags.SKIP]?: boolean
  [ObservableFlags.IS_OBSERVABLE]?: boolean
  [ObservableFlags.IS_READONLY]?: boolean
  [ObservableFlags.IS_SHALLOW]?: boolean
  [ObservableFlags.RAW]?: any
}

export const observableMap = new WeakMap<object, Map<PropertyKey, Set<Reaction>>>()
export const readonlyMap = new WeakMap<Target, any>()

function createObservableObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<object> = mutableHandlers
) {
  if (!isObject(target)) {
    return target
  }

  const proxyMap = isReadonly ? readonlyMap : observableMap
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  if (target[ObservableFlags.IS_OBSERVABLE] && target[ObservableFlags.RAW]) {
    // 判断是否是代理对象 observable(observable(target)) 防止嵌套代理
    return target
  }

  const proxy = new Proxy(target, baseHandlers)

  proxyMap.set(target, proxy)
  return proxy
}

export function observable<T extends object>(target: T): T

export function observable(target: object) {
  if (target && target[ObservableFlags.IS_OBSERVABLE]) {
    return target
  }
  return createObservableObject(target, false, mutableHandlers)
}

export function shallowObservable<T extends object>(target: T): T {
  return createObservableObject(target, false, shallowObservableHandlers)
}

type DeepReadonly<T extends Record<string, any>> = T extends any
  ? {
      readonly [K in keyof T]: T[K] extends Record<string, any> ? DeepReadonly<T[K]> : T[K]
    }
  : never

export function readonly<T extends object>(target: T): DeepReadonly<T>

export function readonly<T extends object>(target: T): T

export function readonly(target: object) {
  return createObservableObject(target, true, readonlyHandlers)
}

export function isObservable(value: any) {
  if (isReadonly(value)) {
    return isObservable((value as Target)[ObservableFlags.RAW])
  }
  return !!(value && (value as Target)[ObservableFlags.IS_OBSERVABLE])
}

export function isReadonly(value: any) {
  return !!(value && (value as Target)[ObservableFlags.IS_READONLY])
}

export function toRaw<T>(observed: T) {
  return observed[ObservableFlags.RAW] || observed
}
