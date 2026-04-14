// @ts-ignore
import type { JSX } from 'vue/jsx-runtime'
import type { App, AppContext, Plugin, PropType, Ref, SlotsType, VNode } from 'vue'
import type { VueComponent } from '../types'

/**
 * 提取对象中值为 VueComponent 类型的属性（支持索引签名）
 * 结果：{ b: VueComponent }
 */
export type ExtractComponent<T extends object> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : symbol extends K
    ? never
    : // 步骤2：排除 undefined，然后检查是否为
    // 同时排除普通函数（如 beforeUpdate），只保留组件
    NonNullable<T[K]> extends VueComponent
    ? // 额外检查：排除纯粹的 Function 类型（方法）
      // 通常包含特定的 brand 或结构，与普通 Function 不同
      NonNullable<T[K]> extends (...args: any[]) => any
      ? VueComponent extends NonNullable<T[K]>
        ? K
        : never // 如果是函数，必须是 Component 子类型
      : K // 非函数类型（如对象组件），直接保留
    : never]: T[K] // 步骤1：排除索引签名键（string/number/symbol）
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type PickRequiredOptional<T, R extends keyof T, P extends keyof T> = Required<Pick<T, R>> &
  Partial<Pick<T, P>>

export type SFCWithInstall<T> = T & Plugin

export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
  _context: AppContext | null
}

// https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
export const tuple = <T extends string[]>(...args: T) => args

export const tupleNum = <T extends number[]>(...args: T) => args

/**
 * https://stackoverflow.com/a/59187769
 * Extract the type of an element of an array/tuple without performing indexing
 */
export type ElementOf<T> = T extends (infer E)[] ? E : T extends readonly (infer F)[] ? F : never

/**
 * https://github.com/Microsoft/TypeScript/issues/29729
 */
export type LiteralUnion<T extends string> = T | (string & Record<string, any>)

export type Data = Record<string, unknown>

export type Key = string | number

type DefaultFactory<T> = (props: Data) => T | null | undefined

export interface PropOptions<T = any, D = T> {
  type?: PropType<T> | true | null
  required?: boolean
  default?: D | DefaultFactory<D> | null | undefined | object
  validator?(value: unknown): boolean
}

declare type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void

// eslint-disable-next-line no-undef
export type VueNode = VNodeChildAtom | VNodeChildAtom[] | JSX.Element

export type MaybeRef<T> = T | Ref<T>

export function eventType<T>() {
  return { type: [Function, Array] as PropType<T | T[]> }
}

export function objectType<T = Record<string, any>>(defaultVal?: T) {
  return { type: Object as PropType<T>, default: defaultVal as T }
}

export function booleanType(defaultVal?: boolean) {
  return { type: Boolean, default: defaultVal as boolean }
}

export function functionType<T = () => Record<string, any>>(defaultVal?: T) {
  return { type: Function as PropType<T>, default: defaultVal as T }
}

export function anyType<T = any>(defaultVal?: T, required?: boolean) {
  const type = { validator: () => true, default: defaultVal as T } as unknown
  return required
    ? (type as {
        type: PropType<T>
        default: T
        required: true
      })
    : (type as {
        default: T
        type: PropType<T>
      })
}
export function vNodeType<T = VueNode>() {
  return { validator: () => true } as unknown as { type: PropType<T> }
}

export function arrayType<T extends any[]>(defaultVal?: T) {
  return { type: Array as unknown as PropType<T>, default: defaultVal as T }
}

export function stringType<T extends string = string>(defaultVal?: T) {
  return {
    type: String as unknown as PropType<T | string>,
    default: defaultVal as T
  }
}

export function numberType<T extends number = number>(defaultVal?: T) {
  return { type: Number as unknown as PropType<T>, default: defaultVal as T }
}

export function someType<T>(types?: any[], defaultVal?: T) {
  return types ? { type: types as PropType<T>, default: defaultVal as T } : anyType<T>(defaultVal)
}

export type CustomSlotsType<T extends Record<string, any>> = SlotsType<T>

export type AnyObject = Record<PropertyKey, any>

export const withInstallVue = <T, E extends Record<string, any>>(main: T, extra?: E) => {
  ;(main as SFCWithInstall<T>).install = (app: any): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp)
    }
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      ;(main as any)[key] = comp
    }
  }
  return main as SFCWithInstall<T> & E
}

export const withInstall = <T, E extends Record<string, any>>(main: T, extra?: E) => {
  ;(main as SFCWithInstall<T>).install = (app): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp)
    }
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      ;(main as any)[key] = comp
    }
  }
  return main as SFCWithInstall<T> & E
}

export const withInstallFunction = <T>(fn: T, name: string) => {
  ;(fn as SFCWithInstall<T>).install = (app: App) => {
    ;(fn as SFCInstallWithContext<T>)._context = app._context
    app.config.globalProperties[name] = fn
  }

  return fn as SFCInstallWithContext<T>
}
