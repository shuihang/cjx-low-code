import { isArray, isObject, isString } from './shared'
type EachArrayIterator<T> = (currentValue: T, key: number) => void | boolean
type EachStringIterator = (currentValue: string, key: number) => void | boolean
type EachObjectIterator<T = any> = (currentValue: T, key: string) => void | boolean

export const toArr = (val: any): any[] => (isArray(val) ? val : val ? [val] : [])

export function each(val: string, iterator: EachStringIterator, revert?: boolean): void
export function each<T>(val: T[], iterator: EachArrayIterator<T>, revert?: boolean): void
export function each<T extends Record<string, unknown>, TValue extends T[keyof T]>(
  val: T,
  iterator: EachObjectIterator<TValue>,
  revert?: boolean
): void
export function each<T extends Record<string, unknown>, TValue extends T[keyof T]>(
  val: T,
  iterator: EachObjectIterator<TValue>,
  revert?: boolean
): void
export function each(val: any, iterator: any, revert?: boolean): void {
  if (isArray(val) || isString(val)) {
    if (revert) {
      for (let i: number = val.length - 1; i >= 0; i--) {
        if (iterator(val[i], i) === false) {
          return
        }
      }
    } else {
      let index = 0
      for (const item of val) {
        if (iterator(item, index) === false) {
          return
        }
        index++
      }
    }
  } else if (isObject(val)) {
    let key: string
    for (key in val) {
      if (Object.hasOwnProperty.call(val, key)) {
        if (iterator(val[key], key) === false) {
          return
        }
      }
    }
  }
}
type MemoArrayIterator<T, U> = (previousValue: U, currentValue: T, key: number) => U

type MemoStringIterator<T> = (previousValue: T, currentValue: string, key: number) => T

type MemoObjectIterator<TValue, TResult> = (
  previousValue: TResult,
  currentValue: TValue,
  key: string
) => TResult

export function reduce<T, U>(
  val: T[],
  iterator: MemoArrayIterator<T, U>,
  accumulator?: U,
  revert?: boolean
): U
export function reduce<T>(
  val: string,
  iterator: MemoStringIterator<T>,
  accumulator?: T,
  revert?: boolean
): T
export function reduce<T extends Record<string, unknown>, TValue extends T[keyof T], TResult = any>(
  val: T,
  iterator: MemoObjectIterator<TValue, TResult>,
  accumulator?: TResult,
  revert?: boolean
): TResult
export function reduce(val: any, iterator: any, accumulator?: any, revert?: boolean): any {
  let result = accumulator
  each(
    val,
    (item, key) => {
      result = iterator(result, item, key)
    },
    revert
  )
  return result
}
