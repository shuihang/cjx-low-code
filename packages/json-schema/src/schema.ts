import { instOf, isArray } from '@cjx-low-code/shared'
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
> implements ISchema {
  parent?: Schema
  root?: Schema
  type?: SchemaTypes
  name!: string
  component?: Component
  componentProps?: ComponentProps
  children?: Schema<any, any, any, any, any, any, any, any>[]

  schema?: ISchema<
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

  constructor(
    json:
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
        >
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
        >[],
    parent?: Schema
  ) {
    if (parent) {
      this.parent = parent
      this.root = parent.root
    } else {
      this.root = this
    }

    if (!isArray(json)) {
      this.type = json.type
      this.name = json.name
    }
    return this.fromJSON(json)
  }

  setChildren = (
    children: ISchema<
      Decorator,
      Component,
      DecoratorProps,
      ComponentProps,
      Pattern,
      Display,
      Validator,
      Message,
      ReactionField
    >[],
    parent?: Schema
  ) => {
    this.children = this.children || []
    children.forEach((item) => {
      const child = parent?.addSchemaChildren(item)
      if (item.children && isArray(item.children)) {
        this.setChildren(item.children as any, child)
      }
    })
  }

  addSchemaChildren = (
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
    const index = this.children?.length || 0
    this.children = this.children || []
    this.children[index] = new Schema(schema, this)
    return this.children[index] as Schema
  }

  removeSchemaChildren = (index: number) => {
    if (!this.children) return this
    this.children.splice(index, 1)
    return this
  }

  setSchemaChildren = (
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
    if (!this.children) return this
    this.children[index] = new Schema(schema, this)
    return this.children[index]
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
      // rules,
      type: schema.type,
      // 存储原始 schema 用于渲染
      component: schema['component'],
      componentProps: schema['componentProps'] || {},
      decorator: schema['decorator'],
      decoratorProps: schema['decoratorProps'] || {},
      slots: schema['slots'] || {}
      // reactions: schema['reactions'],
      // enum: schema.enum
    }

    return fieldProps
  }

  toFieldProps = (options?: ISchemaTransformerOptions): IFieldFactoryProps<any, any> => {
    //return Schema.parseSchemas(this.schemas || [])
    return transformFieldProps(this, options || {})
  }

  getSchema = (options: ISchemaTransformerOptions): ISchema => {
    return this.schema
  }

  parseSchema(schemas: ISchema): IFieldProps {
    return Schema.parse(schemas.name || '', schemas)
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
  static parseSchemas(schemas: ISchema[], parentPath = ''): IFieldProps[] {
    const fields: IFieldProps[] = []
    for (const item of schemas) {
      const fieldProps = this.parse(item.name || '', item, parentPath)
      if ((['array', 'object'] as SchemaTypes[]).includes(item.type) && item.items) {
        const childFields = this.parseSchemas(item.items as ISchema[], fieldProps.name)
        fields.push(...childFields)
      }

      fields.push(fieldProps)
    }
    return fields
  }

  fromJSON = (
    json:
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
        >
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
  ) => {
    if (!json) return this
    if (Schema.isSchemaInstance(json)) return json

    if (isArray(json)) {
      json.forEach((item) => {
        const parent = this.addSchemaChildren(item)
        if (item.children && isArray(item.children)) {
          this.setChildren(item.children as any, parent)
        }
      })
    } else {
      this.schema = json
    }
    return this
  }
}
