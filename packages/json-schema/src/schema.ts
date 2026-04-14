import { instOf } from '@cjx-low-code/shared'
import { transformFieldProps } from './transformer'
import type {
  IFieldFactoryProps,
  IFieldProps,
  IValidatorRule,
  JSXComponent
} from '@cjx-low-code/core'
import type { ISchema, ISchemaTransformerOptions, SchemaTypes } from './types'

export type BaseField = Omit<
  ISchema,
  'component' | 'decorator' | 'componentProps' | 'decoratorProps' | 'slots'
>

export class Schema<
  Decorator = any,
  Component = any,
  DecoratorProps = any,
  ComponentProps = any,
  Pattern = any,
  Display = any,
  Validator = any,
  Message = any,
  ReactionField = any
> implements ISchema
{
  type?: SchemaTypes
  name!: string
  component?: Component
  componentProps?: ComponentProps

  schemas?:
    | ISchema<
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
    | []

  constructor(
    json: ISchema<
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
  ) {
    return this.fromJSON(json)
  }

  addSchema = (
    schema: ISchema<
      Decorator,
      Component,
      DecoratorProps,
      ComponentProps,
      Pattern,
      Display,
      Validator,
      Message,
      ReactionField
    >
  ) => {
    this.schemas = this.schemas || []
    this.schemas.push(schema)
    return this.schemas[this.schemas.length - 1]
  }

  removeSchema = (index: number) => {
    if (!this.schemas) return this
    const schema = this.schemas[index]
    this.schemas.splice(index, 1)
    return schema
  }

  setSchemas = (
    index: number,
    schema: ISchema<
      Decorator,
      Component,
      DecoratorProps,
      ComponentProps,
      Pattern,
      Display,
      Validator,
      Message,
      ReactionField
    >
  ) => {
    if (!this.schemas) return this
    this.schemas[index] = schema
    return this
  }

  static isSchemaInstance = (value: any): value is Schema => {
    return instOf(value, Schema)
  }

  static parse(name: string, schema: ISchema, parentPath = ''): IFieldProps {
    const fullPath = parentPath ? `${parentPath}.${name}` : name

    // 解析验证规则
    const rules = this.parseValidator(schema.validator)

    // 构建 FieldProps
    const fieldProps: IFieldProps<JSXComponent, JSXComponent> = {
      name: fullPath,
      value: schema.default,
      title: schema.title,
      description: schema.description,
      disabled: schema['disabled'],
      readOnly: schema['readOnly'],
      display: schema['display'],
      rules,
      type: schema.type,
      // 存储原始 schema 用于渲染
      component: schema['component'],
      componentProps: schema['componentProps'] || {},
      decorator: schema['decorator'],
      decoratorProps: schema['decoratorProps'] || {}
      // reactions: schema['reactions'],
      // enum: schema.enum
    }

    return fieldProps
  }

  toFieldProps = (options?: ISchemaTransformerOptions): IFieldFactoryProps<any, any> => {
    return transformFieldProps(this, options || {})
  }

  private static parseValidator(
    validator: IValidatorRule | IValidatorRule[] | string | undefined
  ): IValidatorRule[] {
    if (!validator) return []

    if (typeof validator === 'string') {
      return [{ required: true, message: validator }]
    }

    if (Array.isArray(validator)) {
      return validator
    }

    return [validator]
  }

  /**
   * 解析对象类型的 Schema
   * 返回所有字段的配置列表
   */
  static parseProperties(schemas: ISchema[], parentPath = ''): IFieldProps[] {
    const fields: IFieldProps[] = []
    for (const item of schemas) {
      const fieldProps = this.parse(item.name || '', item, parentPath)
      if (item.type === 'array' && item.items) {
        const childFields = this.parseProperties(item.items as ISchema[], fieldProps.name)
        fields.push(...childFields)
      }

      fields.push(fieldProps)
    }
    return fields
  }

  static getSchemas = (schema: Schema): ISchema[] => {
    if (!schema.schemas) return []
    return schema.schemas
  }

  fromJSON = (
    json: ISchema<
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
  ) => {
    if (!json) return this
    if (Schema.isSchemaInstance(json)) return json
    this.schemas = json
    return this
  }
}
