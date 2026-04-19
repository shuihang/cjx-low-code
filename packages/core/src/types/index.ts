import type { FormPath } from '@cjx-low-code/shared'
import type { Form } from '../models/Form'
import type { Field } from '../models/Field'

export type AnyFunction = (...args: any[]) => any

export type SchemaTypes =
  | 'string'
  | 'object'
  | 'array'
  | 'number'
  | 'boolean'
  | 'void'
  | 'date'
  | 'datetime'
  | (string & Record<string, unknown>)

export type FormPathPattern =
  | string
  | number
  | Array<string | number>
  | FormPath
  | RegExp
  | (((address: Array<string | number>) => boolean) & {
      path: FormPath
    })

export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? never : K
}[keyof T]

export type IFieldState = OmitState<Field>
// {
//   name: string
//   value: ValueType
//   title: TextType
//   description: TextType
//   disabled: boolean
//   readOnly: boolean
//   display: FieldDisplayTypes
//   visible: boolean
//   hidden: boolean
//   valid: boolean
//   invalid: boolean
//   validating: boolean
//   errors: string[]
//   selfErrors: string[]
//   rules: IValidatorRule[]
//   required: boolean
//   initialized: boolean
//   mounted: boolean
//   unmounted: boolean
// }

type OmitState<P extends Field> = Omit<
  P,
  | 'state'
  | 'form'
  | 'parent'
  | 'reactions'
  | 'validateController'
  | 'setValue'
  | 'getValue'
  | 'validate'
  | 'onMount'
  | 'onUnmount'
  | 'onInput'
  | 'onFocus'
  | 'onBlur'
  | 'reset'
  | 'subscribe'
  | 'getPath'
  | 'setTitle'
  | 'setDescription'
  | 'decoratorType'
  | 'decoratorProps'
  | 'componentType'
  | 'componentProps'
  | 'slots'
  | 'component'
  | 'decorator'
  | 'setDisplay'
  | 'disable'
  | 'enable'
  | 'setReadOnly'
  | 'selfDisplay'
  | 'selfPattern'
  | 'originValues'
  | 'originInitialValues'
  | 'id'
  | 'address'
  | 'path'
  | 'lifecycles'
  | 'disposers'
  | 'requests'
  | 'fields'
  | 'graph'
  | 'heart'
  | 'indexes'
  | 'props'
  | 'displayName'
  | 'setState'
  | 'getState'
>

export interface IValidatorRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  validator?: (value: unknown) => string | Promise<string | undefined> | undefined
}

export type JSXComponent = any

export type FieldDisplayTypes = 'none' | 'hidden' | 'visible' | (Record<string, unknown> & string)

export type FormPatternTypes =
  | 'editable'
  | 'readOnly'
  | 'disabled'
  | 'readPretty'
  | (Record<string, unknown> & string)

export type FieldComponent<Component extends JSXComponent, ComponentProps = any> =
  | [Component]
  | [Component, ComponentProps]
  | boolean
  | any[]

export type FieldDecorator<Decorator extends JSXComponent, ComponentProps = any> =
  | [Decorator]
  | [Decorator, ComponentProps]
  | boolean
  | any[]

export type FieldReaction = (field: Field) => void

export interface IFieldProps<
  Decorator extends JSXComponent = any,
  Component extends JSXComponent = any,
  TextType = any,
  ValueType = any,
  Pattern = any,
  Display = any,
  Validator = any,
  Message = any,
  ReactionField = any
> {
  basePath?: FormPath
  // 字段名（路径）
  name: string
  // 当前值
  value?: ValueType
  // 初始值
  initialValue?: ValueType
  // 字段标题
  title?: TextType
  // 字段描述
  description?: TextType
  // 是否禁用
  disabled?: boolean
  // 是否只读
  readOnly?: boolean
  // 是否可见
  display?: FieldDisplayTypes
  // 验证规则
  rules?: IValidatorRule[]
  // 字段类型（用于渲染）
  type?: SchemaTypes
  // 字段装饰器
  decorator?: FieldDecorator<Decorator>
  // 装饰器属性
  decoratorProps?: Record<string, unknown>
  // 字段组件
  component?: FieldComponent<Component>
  // 组件属性
  componentProps?: Record<string, unknown>
  // 组件响应器
  reactions?: FieldReaction[] | FieldReaction // SchemaReaction<ReactionField>
  // 组件槽位
  slots?: any
  // 其他属性
}

export interface IFieldFactoryProps<
  Decorator extends JSXComponent,
  Component extends JSXComponent,
  TextType = any,
  ValueType = any
> extends IFieldProps<Decorator, Component, TextType, ValueType> {
  name: string
}

// export type IFieldState = Partial<
//   Pick<Field, NonFunctionPropertyNames<OmitState<Field<any, any, string, string>>>>
// >

export type GeneralField = Field

export type IGeneralFieldState = IFieldState

export type FieldValidatorContext = IValidatorRule & {
  field?: Field
  form?: Form
  value?: any
}

export type FieldMatchPattern = FormPathPattern | GeneralField //  GeneralField FormPathPattern | Query

export interface IFieldStateSetter {
  (pattern: FieldMatchPattern, setter: (state: IFieldState) => void): void
  (pattern: FieldMatchPattern, setter: Partial<IFieldState>): void
}

export interface IModelSetter<P = any> {
  (setter: (state: P) => void): void
  (setter: Partial<P>): void
  (): void
}
