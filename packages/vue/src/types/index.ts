import { defineComponent } from 'vue'
import type {
  Component,
  ComponentOptionsMixin,
  CreateComponentPublicInstanceWithMixins,
  DefineSetupFnComponent,
  EmitsOptions,
  EmitsToProps,
  ObjectPlugin,
  PublicProps,
  SlotsType,
  VNode,
  DefineComponent as VueDefineComponent
} from 'vue'
import type {
  FieldDisplayTypes,
  FormPatternTypes,
  GeneralField,
  IFieldFactoryProps
} from '@cjx-low-code/core'
import type { BaseField, ISchema as JsonSchema, Schema } from '@cjx-low-code/json-schema'
import type { CustomSlotsType } from '../shared'

export type VueComponent = Component

export type ISchemaDefineSetupFnComponent<
  P extends Record<string, any>,
  Components extends SchemaVueComponents = P['$$Components'],
  Props = Omit<P, 'type' | '$$Components'>,
  E extends EmitsOptions = RecordNever,
  S extends SlotsType = SlotsType,
  PP = PublicProps
> = new <
  Component extends FieldVueComponents<Components>,
  Decorator extends FieldVueComponents<Components>
>(
  props: Props & {
    decorator?: Decorator
    decoratorProps?:
      | ExtractMarkupVueComponentProps<Components, Decorator>
      | (string & Record<string, unknown>)
    component?: Component
    componentProps?: Component extends ComponentClass
      ? GetComponentProps<Component>
      : Record<string, any>
  }
) => CreateComponentPublicInstanceWithMixins<
  Props & {
    decorator?: Decorator
    decoratorProps?:
      | ExtractMarkupVueComponentProps<Components, Decorator>
      | (string & Record<string, unknown>)
    component?: Component
    componentProps?: Component extends ComponentClass
      ? GetComponentProps<Component>
      : Record<string, any>
  },
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

export type ISchemaDefineComponent<Props extends Record<string, any>> =
  ISchemaDefineSetupFnComponent<Props>

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

export type DecoratorType<T extends SchemaVueComponents> = {
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
      NonNullable<T[K]> extends (...args: any[]) => any
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
  T extends SchemaVueComponents,
  K extends ComponentMap = ExtractComponent<T['$$types']>
> = ExtractVueFCSchema<K>[]

// 提取子组件（对象中值为 VueComponent 类型的属性）
export type ExtractChildren<T> = T extends object
  ? {
      [K in keyof T as T[K] extends Component
        ? T[K] extends (...args: any[]) => any
          ? never
          : T[K] extends ObjectPlugin['install']
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

export type ExtractFlattenedComponentsProps<
  K extends SchemaVueComponents,
  P extends ComponentKeys<K>
> = GetComponentProps<GetComponentByPath<FlattenedComponents<K>, P & string>>

export type ExtractFlattenedComponentsSlotsType<
  K extends SchemaVueComponents,
  P extends ComponentKeys<K>
> = ComponentSlots<GetComponentByPath<FlattenedComponents<K>, P & string>>

export type VueComponentPath<T extends ComponentClass, K extends SchemaVueComponents> = <
  D extends ComponentKeys<K> | ComponentClass = never
>(
  props: BaseSchemaFieldType<T> & {
    /**
     * 容器组件
     */
    decorator?: D | ComponentClass
    /**
     * 容器组件的属性
     */
    decoratorProps?: D extends ComponentClass
      ? GetComponentProps<D>
      : ExtractFlattenedComponentsProps<K, D & ComponentKeys<K>>
  },
  {
    slots
  }: {
    slots: ComponentSlots<T>
  }
) => BaseSchemaFieldType<T> & DecoratorType<K>

type BaseSchemaFieldType<T extends ComponentClass> = BaseField & {
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

export type FieldVueComponents<Components extends SchemaVueComponents> =
  | ComponentKeys<Components>
  | ComponentClass

export type ExtractMarkupVueComponentProps<
  Components extends SchemaVueComponents,
  Component extends FieldVueComponents<Components>
> = Component extends ComponentClass
  ? GetComponentProps<Component>
  : ExtractFlattenedComponentsProps<Components, Component & ComponentKeys<Components>>

export type ExtractMarkupVueComponentSlots<
  Components extends SchemaVueComponents,
  Component extends FieldVueComponents<Components>
> = Component extends ComponentClass
  ? ComponentSlots<Component>
  : ExtractFlattenedComponentsSlotsType<Components, Component & ComponentKeys<Components>>

export type ISchemaMarkupFieldProps<
  Components extends SchemaVueComponents,
  Decorator extends FieldVueComponents<Components>,
  Component extends FieldVueComponents<Components>
> = Omit<
  JsonSchema<
    Decorator,
    Component,
    ExtractMarkupVueComponentProps<Components, Decorator>,
    ExtractMarkupVueComponentProps<Components, Component>,
    {
      [Key in keyof ExtractMarkupVueComponentSlots<Components, Component>]?:
        | ((
            ...args: Parameters<ExtractMarkupVueComponentSlots<Components, Component>[Key]>
          ) => ReturnType<ExtractMarkupVueComponentSlots<Components, Component>[Key]>)
        | SchemaSlotType
    },
    FormPatternTypes,
    FieldDisplayTypes,
    any, // FieldValidator,
    string,
    GeneralField
  >,
  'type'
>

export type FormModelOptions = {
  model: Record<string, unknown>
  validateKey?: string
  validateFieldsKey?: string
}
