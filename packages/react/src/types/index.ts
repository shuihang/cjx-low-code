import type { JSX } from 'react'
import type React from 'react'
import type { ReactFC } from '@cjx-low-code/reactivity-react'
import type { ObjectField } from '../components/ObjectField'
import type { ISchema, Schema } from '@cjx-low-code/json-schema'
import type {
  Field as FieldType,
  Form,
  FormPathPattern,
  GeneralField,
  IFieldFactoryProps
} from '@cjx-low-code/core'

export type IProviderProps = {
  form: Form
}

export { ReactFC }

export type JSXComponent = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>

export type SchemaReactComponents = Record<string, JSXComponent>

export interface ISchemaFieldReactFactoryOptions<Components extends SchemaReactComponents = any> {
  components?: Components
}

export interface ISchemaFieldProps<
  Decorator extends JSXComponent = any,
  Component extends JSXComponent = any,
  InnerField = ObjectField<Decorator, Component>
> extends Omit<IFieldFactoryProps<Decorator, Component, InnerField>, 'name'> {
  schema?: ISchema[]
  components?: {
    [key: string]: JSXComponent
  }
  name?: string
  children?: React.ReactNode
}

export type RenderPropsChildren<Payload> =
  | ((field: Payload, form: Form) => React.ReactNode)
  | React.ReactNode

export interface IFieldProps<D extends JSXComponent, C extends JSXComponent, Field = FieldType>
  extends IFieldFactoryProps<D, C> {
  children?: RenderPropsChildren<Field>
  decorator?: [] | [D] | [D, React.ComponentProps<D>] | any[]
  component?: [] | [C] | [C, React.ComponentProps<C>] | any[]
}

export interface IComponentMapper<T extends JSXComponent> {
  (target: T): JSXComponent
}

export type IStateMapper<Props> =
  | {
      [key in keyof FieldType]?: keyof Props | boolean
    }
  | ((props: Props, field: GeneralField) => Props)

export interface IRecursionFieldProps {
  schema: Schema
  name?: string
  basePath?: FormPathPattern
}
