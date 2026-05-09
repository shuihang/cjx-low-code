import { defineComponent } from 'vue'
import type { Component, VNode } from 'vue'
import type {
  FieldDisplayTypes,
  FormPatternTypes,
  GeneralField,
  IFieldFactoryProps
} from '@cjx-low-code/core'
import type { ISchema as JsonSchema, Schema } from '@cjx-low-code/json-schema'

export type VueComponent = Component

class Helper<Props> {
  Return = defineComponent({} as Record<keyof Props, any>)
}

export type DefineComponent<Props> = Helper<Props>['Return']

export type JSXComponent = any

export type IFieldProps<
  D extends VueComponent = VueComponent,
  C extends VueComponent = VueComponent
> = IFieldFactoryProps<D, C>

export interface IRecursionFieldProps {
  schema: Schema
  name: string
}

export type Modify<T, R> = Omit<T, keyof R> & R
export type ReactPropsWithChildren<P> = Modify<
  {
    children?: VNode | undefined
  },
  P
>

type RecordNever = Record<string, never>

export type ComponentMap = Record<string, ComponentClass | VueComponent>

export type ComponentClass = abstract new (...args: unknown[]) => any

export type ComponentProps<T extends ComponentClass> = InstanceType<T>['$props']

export type ComponentSlots<T extends ComponentClass> = InstanceType<T>['$slots']

export type VueComponentPropsByPathValue<
  T extends Record<string, any>,
  P extends VueComponentPath<T>
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends VueComponentPath<T[Key]>
      ? VueComponentPropsByPathValue<T[Key], Rest>
      : never
    : ComponentProps<T[P]>
  : P extends keyof T
    ? ComponentProps<T[P]>
    : never

// 根据组件路径获取组件类型（仅支持两层路径如 Input.Search）
export type GetComponentByPath<
  T extends ComponentMap,
  Path extends string
> = Path extends `${infer First}.${infer Second}`
  ? First extends keyof T
    ? T[First] extends ComponentMap
      ? Second extends keyof T[First]
        ? T[First][Second] extends ComponentClass
          ? T[First][Second]
          : never
        : never
      : never
    : never
  : Path extends keyof T
    ? T[Path] extends ComponentClass
      ? T[Path]
      : never
    : never

export type DecoratorType<T extends SchemaVueComponents> = {
  [K in VueComponentPath<T>]?: {
    /**
     * 容器组件名称
     */
    decorator?: K
    /**
     * 容器组件属性
     */
    decoratorProps?: T[K] extends ComponentClass ? Partial<ComponentProps<T[K]>> : RecordNever
  }
}[VueComponentPath<T>]

export type SchemaType<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? Omit<JsonSchema<unknown, unknown, unknown, unknown, unknown>, 'children'> & {
        component?: K
        componentProps?: T[K]['componentProps']
        slots?: T[K]['slots']
        children?: SchemaType<T>[]
      } & T[K]['decorator']
    : never
}[keyof T]

export type VueComponentTypeData<
  Component extends ComponentClass,
  Components extends SchemaVueComponents
> = {
  componentProps?: Partial<ComponentProps<Component>>
  decorator?:
    | DecoratorType<Components>
    | {
        decorator?: null | undefined
        decoratorProps?: {
          [K: string]: never
        }
      }
  slots?: {
    [key in keyof ComponentSlots<Component>]?:
      | ((
          ...args: Parameters<ComponentSlots<Component>[key]>
        ) => ReturnType<ComponentSlots<Component>[key]>)
      | SchemaSlotType
  }
}

export type ISchema<
  T extends SchemaVueComponents,
  K extends Record<string, unknown> = T extends {
    ['$$components']: infer M extends Record<string, unknown>
  }
    ? M
    : never
> = SchemaType<K>[]

// 提取子组件（对象中值为 ComponentClass 类型的属性）
export type ExtractChildren<T> = T extends object
  ? {
      [K in keyof T as T[K] extends ComponentClass
        ? string extends K
          ? never
          : number extends K
            ? never
            : symbol extends K
              ? never
              : K
        : never]: T[K] extends ComponentClass ? T[K] : never
    }
  : RecordNever

export type SchemaSlotType = string | number | VNode | VNode[]

export type KeyOfVueComponent<T> = keyof T

export type VueComponentPath<
  T extends SchemaVueComponents,
  Key extends keyof T = keyof T
> = Key extends string
  ? T[Key] extends VueComponent
    ? `${Key}.${Extract<keyof ExtractChildren<T[Key]>, string>}` | Key
    : Key
  : never

export type SchemaVueComponents = Record<string, VueComponent>

export type VueComponentOptionsWithProps = {
  props: unknown
}

export type VueComponentProps<T extends VueComponent> = T extends VueComponentOptionsWithProps
  ? T['props']
  : T

export type ISchemaMarkupFieldProps<
  Decorator,
  Component,
  ComponentPropsMap = unknown,
  ComponentSlotsMap = unknown
> = Omit<
  JsonSchema<
    Decorator,
    Component,
    Decorator extends ComponentClass
      ? ComponentProps<Decorator>
      : (ComponentPropsMap & Record<string, any>)[Decorator & string],
    Component extends ComponentClass
      ? ComponentProps<Component>
      : (ComponentPropsMap & Record<string, any>)[Component & string],
    Component extends ComponentClass
      ? {
          [key in keyof ComponentSlots<Component>]?:
            | ((
                ...args: Parameters<ComponentSlots<Component>[key]>
              ) => ReturnType<ComponentSlots<Component>[key]>)
            | SchemaSlotType
        }
      : (ComponentSlotsMap & Record<string, any>)[Component & string],
    FormPatternTypes,
    FieldDisplayTypes,
    any, // FieldValidator,
    string,
    GeneralField
  >,
  'type' | 'children'
>

// 缓存路径解析结果，避免同一 key 重复调用 GetComponentByPath
export type ComponentPropsMapValue<
  Components extends SchemaVueComponents,
  P extends string
> = GetComponentByPath<Components, P> extends infer C
  ? C extends ComponentClass
    ? ComponentProps<C>
    : never
  : never

export type ComponentSlotsMapValue<
  Components extends SchemaVueComponents,
  P extends string
> = GetComponentByPath<Components, P> extends infer C
  ? C extends ComponentClass
    ? {
        [key in keyof ComponentSlots<C>]?:
          | ((...args: Parameters<ComponentSlots<C>[key]>) => ReturnType<ComponentSlots<C>[key]>)
          | SchemaSlotType
      }
    : never
  : never

export type ComponentPathToVueComponentPath<
  Components extends SchemaVueComponents,
  P extends string
> = GetComponentByPath<Components, P> extends infer C
  ? C extends ComponentClass
    ? VueComponentTypeData<C, Components>
    : never
  : never

export type FormModelOptions = {
  model: Record<string, unknown>
  validateKey?: string
  validateFieldsKey?: string
}
export interface SchemaFieldOptions<Components extends SchemaVueComponents = any> {
  components?: Components
}
