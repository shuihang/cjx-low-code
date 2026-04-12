import { instOf } from './instanceof'

const objectToString = Object.prototype.toString
const toTypeString = (value: unknown): string => objectToString.call(value)

export const isNaN = (val: unknown): val is boolean => Number.isNaN(Number(val))

export const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean'

export const isArray =
  Array.isArray || ((value: unknown): value is any[] => toTypeString(value) === '[object Array]') // 兼容 ES5 和 ES6 的判断是否是数组的方法
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === '[object Set]'
export const isDate = (val: unknown): val is Date => toTypeString(val) === '[object Date]'
export const isRegExp = (val: unknown): val is RegExp => toTypeString(val) === '[object RegExp]'
export const isFunction = (val: unknown): val is (...args: any[]) => any =>
  typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'
export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]'
export const isNumber = (val: any): val is number => typeof val === 'number'

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return (
    (isObject(val) || isFunction(val)) &&
    isFunction((val as any).then) &&
    isFunction((val as any).catch)
  )
}

const hasOwnProperty = Object.prototype.hasOwnProperty
/**
 * 检查对象是否有指定属性的直接属性 （不包括继承属性）
 */
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val =>
  hasOwnProperty.call(val, key)

/**
 * 检查值是否改变，考虑 NaN 等特殊值
 * 例如：hasChanged(NaN, NaN) === true
 * 例如：hasChanged(-0, +0) === false
 */
export const hasChanged = (value: any, oldValue: any) => {
  return !Object.is(value, oldValue)
}

export const isValid = (val: any) => val !== undefined && val !== null

export const isUndef = (val: any) => val === undefined
const has = Object.prototype.hasOwnProperty

const toString = Object.prototype.toString

export function isEmpty(val: any, strict = false): boolean {
  // Null and Undefined...
  if (val == null) {
    return true
  }

  // Booleans...
  if (typeof val === 'boolean') {
    return false
  }

  // Numbers...
  if (typeof val === 'number') {
    return false
  }

  // Strings...
  if (typeof val === 'string') {
    return val.length === 0
  }

  // Functions...
  if (typeof val === 'function') {
    return val.length === 0
  }

  // Arrays...
  if (Array.isArray(val)) {
    if (val.length === 0) {
      return true
    }
    for (const element of val) {
      if (strict) {
        if (element !== undefined && element !== null) {
          return false
        }
      } else {
        if (element !== undefined && element !== null && element !== '' && element !== 0) {
          return false
        }
      }
    }
    return true
  }

  // Errors...
  if (instOf(val, 'Error')) {
    return val.message === ''
  }

  // Objects...
  if (val.toString === toString) {
    switch (val.toString()) {
      // Maps, Sets, Files and Errors...
      case '[object File]':
      case '[object Map]':
      case '[object Set]': {
        return val.size === 0
      }

      // Plain objects...
      case '[object Object]': {
        for (const key in val) {
          if (has.call(val, key)) {
            return false
          }
        }

        return true
      }
    }
  }

  // Anything else...
  return false
}
