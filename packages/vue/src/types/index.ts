import { defineComponent } from 'vue'
import type {
  Component,
  ComponentOptionsMixin,
  CreateComponentPublicInstanceWithMixins,
  EmitsOptions,
  PublicProps,
  SlotsType,
  VNode
} from 'vue'
import type {
  FieldDisplayTypes,
  FormPatternTypes,
  GeneralField,
  IFieldFactoryProps
} from '@cjx-low-code/core'
import type { BaseField, ISchema as JsonSchema, Schema } from '@cjx-low-code/json-schema'

export type VueComponent = Component

export type ISchemaDefineSetupFnComponent<
  ComponentPropsMap extends Record<string, any>,
  ComponentSlotsMap extends Record<string, any>,
  E extends EmitsOptions = RecordNever,
  S extends SlotsType = SlotsType,
  PP = PublicProps
> = new <
  Component extends keyof ComponentPropsMap & keyof ComponentSlotsMap,
  Decorator extends keyof ComponentPropsMap
>(
  props: ISchemaMarkupFieldProps<
    Decorator,
    Component,
    ComponentPropsMap[Decorator],
    ComponentPropsMap[Component],
    ComponentSlotsMap[Component]
  >
) => CreateComponentPublicInstanceWithMixins<
  ISchemaMarkupFieldProps<
    Decorator,
    Component,
    ComponentPropsMap[Decorator],
    ComponentPropsMap[Component],
    ComponentSlotsMap[Component]
  >,
  RecordNever,
  RecordNever,
  RecordNever,
  RecordNever,
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  E, // Emits
  PP, // PublicProps
  RecordNever,
  false,
  RecordNever,
  S // Slots
>

export type ISchemaDefineComponent<
  _Type,
  ComponentPropsMap extends Record<string, any>,
  ComponentSlotsMap extends Record<string, any>
> = ISchemaDefineSetupFnComponent<ComponentPropsMap, ComponentSlotsMap>

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

export type SchemaFieldOptions = {
  component: SchemaVueComponents
}

export type ComponentClass = abstract new (...args: unknown[]) => any

export type GetComponentProps<T extends ComponentClass> = InstanceType<T>['$props']

export type ComponentSlots<T extends ComponentClass> = InstanceType<T>['$slots']

// 将联合类型转换为交叉类型
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
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

export type DecoratorType<T extends Record<string, any>> = {
  [K in keyof T]: {
    /**
     * 容器组件名称
     */
    decorator?: K
    /**
     * 容器组件属性
     */
    decoratorProps?: 'componentProps' extends keyof T[K] ? T[K]['componentProps'] : never
  }
}[keyof T]

export type ExtractVueFCSchema<T extends object> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? BaseField & {
        /**
         * 组件名称
         */
        component?: K
      } & T[K]
    : never
}[keyof T]

export type ISchema<
  T extends SchemaVueComponents,
  K extends Record<string, unknown> = T extends {
    $$types: infer M extends Record<string, unknown>
  }
    ? M
    : never
> = (ExtractVueFCSchema<K> & DecoratorType<K>)[]

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
  : Record<string, never>

type IsStringLiteral<T> = T extends string
  ? string extends T
    ? false // T 是宽泛的 string（如 string 类型本身）
    : true // T 是具体的字面量（如 "SubA" | "SubB"）
  : false

export type ShallowFlattenLevel<T extends SchemaVueComponents> = UnionToIntersection<
  {
    [K in keyof T]: K extends string
      ? {
          [SK in keyof ExtractChildren<T[K]> as SK extends string
            ? IsStringLiteral<SK> extends true // 只保留具体的字面量键
              ? `${K}.${SK}`
              : never
            : never]: ExtractChildren<T[K]>[SK]
        }
      : Record<string, never>
  }[keyof T]
>

export type SchemaSlotType = string | number | VNode | VNode[]

export type FlattenedComponents<T extends SchemaVueComponents> = T & ShallowFlattenLevel<T>
export type ComponentKeys<K extends SchemaVueComponents> = keyof FlattenedComponents<K>

export type VueComponentTypeData<T extends ComponentClass> = {
  /**
   * 组件属性
   */
  componentProps?: Partial<GetComponentProps<T>>
  slots?: {
    [key in keyof ComponentSlots<T>]?:
      | ((...args: Parameters<ComponentSlots<T>[key]>) => ReturnType<ComponentSlots<T>[key]>)
      | SchemaSlotType
  }
}

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
  DecoratorProps = any,
  ComponentProps = any,
  ComponentSlots = any
> = Omit<
  JsonSchema<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    ComponentSlots,
    FormPatternTypes,
    FieldDisplayTypes,
    any, // FieldValidator,
    string,
    GeneralField
  >,
  'type'
>

export type VueSchemaField<
  _Type,
  ComponentPropsMap extends Record<string, any>,
  ComponentSlotsMap extends Record<string, any>
> = <
  Component extends keyof ComponentPropsMap & keyof ComponentSlotsMap,
  Decorator extends keyof ComponentPropsMap
>(
  props: ISchemaMarkupFieldProps<
    Decorator,
    Component,
    ComponentPropsMap[Decorator],
    ComponentPropsMap[Component],
    ComponentSlotsMap[Component]
  >,
  ctx: { slots: unknown }
) => unknown

// 缓存路径解析结果，避免同一 key 重复调用 GetComponentByPath
export type ComponentPropsMapValue<
  Components extends SchemaVueComponents,
  P extends string
> = GetComponentByPath<Components, P> extends infer C
  ? C extends ComponentClass
    ? GetComponentProps<C>
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
    ? VueComponentTypeData<C>
    : never
  : never

export type ISchemaDefineComponentProps = JsonSchema<unknown, unknown, unknown, unknown, unknown>

export type FormModelOptions = {
  model: Record<string, unknown>
  validateKey?: string
  validateFieldsKey?: string
}
