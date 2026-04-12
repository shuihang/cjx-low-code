import { defineComponent } from 'vue'
import type {
  AllowedComponentProps,
  Component,
  ComponentCustomProps,
  ObjectPlugin,
  VNode,
  VNodeProps,
  DefineComponent as VueDefineComponent
} from 'vue'
import type {
  FieldDisplayTypes,
  FormPatternTypes,
  GeneralField,
  IFieldFactoryProps
} from '@cjx-low-code/core'
import type { BaseField, ISchema as JsonSchemaSchema, Schema } from '@cjx-low-code/json-schema'
import type { CustomSlotsType } from '../shared'

export type VueComponent = Component

export type EmitsAddArgs<
  T extends object,
  ArgsGroups extends readonly unknown[][] = [],
  Position extends 'start' | 'end' = 'start'
> = {
  [K in keyof T]-?: T[K] extends ((...args: infer Args) => infer Return) | undefined
    ? Args extends []
      ? (...args: [...ArgsGroups[number]]) => Return
      : Position extends 'start'
      ? (...args: [...ArgsGroups[number], ...Args]) => Return
      : (...args: [...Args, ...ArgsGroups[number]]) => Return
    : T[K]
}

export type IsEmptyToNeverObj<T> = T extends object
  ? keyof T extends never
    ? { [key in string]: never }
    : T
  : never

type RemoveFunctions<T> = {
  [K in keyof T as T[K] extends ((...args: any[]) => any) | undefined ? never : K]-?: T[K]
}

type PropsAndEmits<T> = Omit<T, keyof (VNodeProps & AllowedComponentProps & ComponentCustomProps)>

export type ExtractComponentProps<T> = RemoveFunctions<PropsAndEmits<T>>

export type ExtractComponentsEmits<
  T,
  ArgsGroups extends readonly unknown[][] = [],
  Position extends 'start' | 'end' = 'start'
> = IsEmptyToNeverObj<
  EmitsAddArgs<Omit<PropsAndEmits<T>, keyof ExtractComponentProps<T>>, ArgsGroups, Position>
>

class Helper<Props> {
  Return = defineComponent({} as { props: Record<keyof Props, any> })
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

// export type VueFC<P extends object, S extends Record<string, unknown> = any> = FunctionalComponent<
//   P,
//   any,
//   S // Slots
// >

type RecordNever = Record<string, never>

export type VueFC<
  P extends object,
  S extends Record<string, unknown> = RecordNever
> = VueDefineComponent<
  RecordNever, // Props
  RecordNever, // RawBindings
  RecordNever, // Data
  RecordNever, // Computed
  RecordNever, // Methods
  RecordNever, // Mixin
  RecordNever, // Extends
  RecordNever, // Emits
  string, // ExposedEmits
  P, // PublicProps
  object, // PropsDef
  object, // Defaults
  CustomSlotsType<S> // Slots
>

export type ComponentMap = Record<string, ComponentClass | VueComponent>

export type SchemaFieldProps = {
  component: ComponentMap
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

// 根据组件路径获取组件类型（递归支持多层路径如 Input.Password.Search）
export type GetComponentByPath<
  T extends ComponentMap,
  Path extends string
> = Path extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? T[First] extends ComponentMap
      ? GetComponentByPath<T[First], Rest>
      : never
    : never
  : Path extends keyof T
  ? T[Path] extends ComponentClass
    ? T[Path]
    : never
  : never

export type DecoratorType<T extends ComponentMap> = {
  [Key in ComponentKeys<T>]: {
    /**
     * 容器组件名称
     */
    decorator?: Key
    /**
     * 容器组件属性
     */
    decoratorProps?: GetComponentProps<GetComponentByPath<T, Key & string>>
  }
}[keyof T]

/**
 * 提取对象中值为 VueFC 类型的属性（支持索引签名）
 * 结果：{ b: VueFC }
 */
export type ExtractComponent<T extends object> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : symbol extends K
    ? never
    : // 步骤2：排除 undefined，然后检查是否为 VueFC
    // 同时排除普通函数（如 beforeUpdate），只保留组件
    NonNullable<T[K]> extends VueFC<any>
    ? // 额外检查：排除纯粹的 Function 类型（方法）
      // VueFC 通常包含特定的 brand 或结构，与普通 Function 不同
      NonNullable<T[K]> extends (...args: unknown[]) => any
      ? VueFC<any> extends NonNullable<T[K]>
        ? K
        : never // 如果是函数，必须是 Component 子类型
      : K // 非函数类型（如对象组件），直接保留
    : never]: T[K] // 步骤1：排除索引签名键（string/number/symbol）
}

export type ExtractVueFCSchema<T extends object> = {
  [K in keyof T]: T[K] extends VueComponentPath<infer _P, infer _S>
    ? {
        /**
         * 组件名称
         */
        component?: K
      } & ReturnType<T[K]>
    : never
}[keyof T]

export type ISchema<
  T extends SchemaFieldProps['component'],
  K extends ComponentMap = ExtractComponent<T>
> = ExtractVueFCSchema<K>[]

// 提取子组件（对象中值为 VueComponent 类型的属性）
export type ExtractChildren<T> = T extends object
  ? {
      [K in keyof T as T[K] extends Component
        ? T[K] extends ObjectPlugin['install']
          ? never
          : string extends K
          ? never
          : number extends K
          ? never
          : symbol extends K
          ? never
          : K
        : never]: T[K] extends Component ? T[K] : never
    }
  : Record<string, never>

// 提取子组件的 key
export type ExtractChildrenKeys<T> = keyof ExtractChildren<T> extends string
  ? keyof ExtractChildren<T>
  : never

type IsStringLiteral<T> = T extends string
  ? string extends T
    ? false // T 是宽泛的 string（如 string 类型本身）
    : true // T 是具体的字面量（如 "SubA" | "SubB"）
  : false

export type ShallowFlattenLevel<T extends ComponentMap> = UnionToIntersection<
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

export type Flatten<T extends ComponentMap> = T & ShallowFlattenLevel<T>

// 通用 SchemaField 配置类型
export type SchemaFieldConfig<
  T extends ComponentMap,
  P extends ComponentKeys<T> | ComponentClass,
  D extends ComponentKeys<T> | ComponentClass
> = {
  component: P
  componentProps?: P extends ComponentClass
    ? GetComponentProps<P>
    : GetProps<T, P & ComponentKeys<T>>
  decorator?: D
  decoratorProps?: D extends ComponentClass
    ? GetComponentProps<D>
    : GetProps<T, D & ComponentKeys<T>>
}

export type FlattenedComponents<K extends ComponentMap> = Flatten<K>
export type ComponentKeys<K extends ComponentMap> = keyof FlattenedComponents<K>
export type GetProps<K extends ComponentMap, P extends ComponentKeys<K>> = GetComponentProps<
  GetComponentByPath<FlattenedComponents<K>, P & string>
>

// 根据子组件名称获取子组件的 props 类型
export type GetVariantProps<
  T extends ComponentClass,
  P extends string
> = ExtractChildren<T> extends Record<P, infer SubComp>
  ? SubComp extends ComponentClass
    ? Partial<ExtractComponentProps<GetComponentProps<SubComp>>>
    : never
  : never

// 根据子组件名称获取子组件的 emits 类型
export type GetVariantEmits<
  T extends ComponentClass,
  P extends string
> = ExtractChildren<T> extends Record<P, infer SubComp>
  ? SubComp extends ComponentClass
    ? Partial<ExtractComponentsEmits<GetComponentProps<SubComp>, [[]]>>
    : never
  : never

export type VueComponentPath<T extends ComponentClass, K extends ComponentMap> = <
  P extends ExtractChildrenKeys<T> = never,
  D extends ComponentKeys<K> | ComponentClass = never
>(
  props: [P] extends [never]
    ? BaseSchemaFieldType<T> & {
        /**
         * 容器组件
         */
        decorator?: D | ComponentClass
        /**
         * 容器组件的属性
         */
        decoratorProps?: D extends ComponentClass
          ? GetComponentProps<D>
          : GetProps<K, D & ComponentKeys<K>>
      }
    : BaseField & {
        /**
         * 用于指定同一组件的不同变体
         */
        variant?: P
        /**
         * 组件的属性
         */
        componentProps?: GetVariantProps<T, P>
        on?: GetVariantEmits<T, P>
        /**
         * 容器组件
         */
        decorator?: D | ComponentClass
        /**
         * 容器组件的属性
         */
        decoratorProps?: D extends ComponentClass
          ? GetComponentProps<D>
          : GetProps<K, D & ComponentKeys<K>>
      },
  {
    slots
  }: {
    slots: ComponentSlots<T>
  }
) => BaseSchemaFieldType<T> &
  DecoratorType<K> & {
    // decorator?: DecoratorType<K>
    /**
     * 插槽
     */
    slots?: {
      [key in keyof ComponentSlots<T>]?: ComponentSlots<T>[key] | string | number | VNode | VNode[]
    }
  }

type BaseSchemaFieldType<C extends ComponentClass> = BaseField & {
  /**
   * 组件属性
   */
  componentProps?: Partial<ExtractComponentProps<GetComponentProps<C>>>
  /**
   * 组件事件
   */
  on?: Partial<ExtractComponentsEmits<GetComponentProps<C>, [[]]>>
}

export type SchemaVueComponents = Record<string, VueComponent>

export type KeyOfComponents<T> = keyof T

export type ComponentPath<
  T,
  Key extends KeyOfComponents<T> = KeyOfComponents<T>
> = Key extends string ? Key : never

export type ComponentPropsByPathValue<
  T extends SchemaVueComponents,
  P extends ComponentPath<T>
> = P extends keyof T ? VueComponentProps<T[P]> : never

export type VueComponentOptionsWithProps = {
  props: unknown
}

export type VueComponentProps<T extends VueComponent> = T extends VueComponentOptionsWithProps
  ? T['props']
  : T

export type ISchemaMarkupFieldProps<
  Components extends SchemaVueComponents = SchemaVueComponents,
  Decorator extends ComponentPath<Components> = ComponentPath<Components>,
  Component extends ComponentPath<Components> = ComponentPath<Components>
> = JsonSchemaSchema<
  Decorator,
  Component,
  ComponentPropsByPathValue<Components, Decorator>,
  ComponentPropsByPathValue<Components, Component>,
  FormPatternTypes,
  FieldDisplayTypes,
  any, // FieldValidator,
  string,
  GeneralField
>

export type FormModelOptions = {
  model: Record<string, unknown>
  validateKey?: string
  validateFieldsKey?: string
}
