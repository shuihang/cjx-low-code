import type { FormPathPattern, GeneralField, IGeneralFieldState } from '@cjx-low-code/core'

export interface IScopeContext {
  [key: string]: any
}

export interface ISchemaTransformerOptions {
  scope?: IScopeContext
}

export type SchemaReaction<Field = any> =
  | {
      dependencies?:
        | Array<
            | string
            | {
                name?: string
                type?: string
                source?: string
                property?: string
              }
          >
        | Record<string, string>
      when?: string | boolean
      target?: string
      effects?: (string & Record<string, unknown>)[]
      fulfill?: {
        state?: Stringify<IGeneralFieldState>
        schema?: ISchema
        run?: string
      }
      otherwise?: {
        state?: Stringify<IGeneralFieldState>
        schema?: ISchema
        run?: string
      }
      [key: string]: any
    }
  | ((field: Field, scope: IScopeContext) => void)

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

export type Stringify<P extends { [key: string]: any }> = {
  /**
   * 使用`string & Record<string, unknown>`来保持ISchema#component和ISchema#decorator的字面类型
   */
  [key in keyof P]?: P[key] // | (string & Record<string, unknown>)
}

export type SchemaEnum<Message> = Array<
  | string
  | number
  | boolean
  | { label?: Message; value?: any; [key: string]: any }
  | { key?: any; title?: Message; [key: string]: any }
>

export type SchemaItems<
  Decorator,
  Component,
  DecoratorProps,
  ComponentProps,
  Pattern,
  Display,
  Validator,
  Message
> = ISchema<
  Decorator,
  Component,
  DecoratorProps,
  ComponentProps,
  Pattern,
  Display,
  Validator,
  Message
>[]

export type SchemaReactions<Field = any> = SchemaReaction<Field> | SchemaReaction<Field>[]

export type ISchema<
  Decorator = any,
  Component = any,
  DecoratorProps = any,
  ComponentProps = any,
  ComponentSlots = any,
  Pattern = any,
  Display = any,
  Validator = any,
  Message = any,
  ReactionField = any
> = Stringify<{
  version?: string
  name?: string
  title?: Message
  description?: Message
  default?: any
  readOnly?: boolean
  writeOnly?: boolean
  type?: SchemaTypes
  enum?: SchemaEnum<Message>
  // multipleOf?: number
  // maximum?: number
  // minimum?: number
  // maxLength?: number
  // minLength?: number
  pattern?: string | RegExp
  // maxItems?: number
  // minItems?: number
  required?: string[] | boolean | string
  // format?: string
  $ref?: string

  children?: ISchema<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    Pattern,
    Display,
    Validator,
    Message,
    ReactionField
  >[]

  items?: SchemaItems<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    Pattern,
    Display,
    Validator,
    Message
  >
}> & {
  value?: any
  //展示状态
  display?: Display
  //校验器
  validator?: Validator
  //装饰器
  decorator?: Decorator | (string & Record<string, unknown>) | ((...args: any[]) => any)
  //装饰器属性
  decoratorProps?: DecoratorProps
  //组件
  component?: Component | (string & Record<string, unknown>) | ((...args: any[]) => any)
  //组件属性
  componentProps?: ComponentProps
  //组件响应器
  reactions?: SchemaReactions<ReactionField>
  //内容
  slots?: ComponentSlots

  data?: any

  visible?: boolean

  hidden?: boolean

  disabled?: boolean

  editable?: boolean
}

export interface ISchemaFieldUpdateRequest {
  state?: Stringify<IGeneralFieldState>
  schema?: ISchema
  run?: string
}

export interface IFieldStateSetterOptions {
  field: GeneralField
  target?: FormPathPattern
  request: ISchemaFieldUpdateRequest
  runner?: string
}
