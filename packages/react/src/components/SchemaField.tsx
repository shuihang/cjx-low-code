import React from 'react'
import { Schema } from '@cjx-low-code/json-schema'
import { SchemaComponentsContext, SchemaMarkupContext, SchemaOptionsContext } from '../shared'
import { RecursionField } from './RecursionField'
import type {
  ISchemaFieldProps,
  ISchemaFieldReactFactoryOptions,
  JSXComponent,
  SchemaReactComponents
} from '../types'

export const createSchemaField = <Components extends SchemaReactComponents = any>(
  options: ISchemaFieldReactFactoryOptions<Components>
) => {
  console.log(options)
  function SchemaField<Decorator extends JSXComponent, Component extends JSXComponent>(
    props: ISchemaFieldProps<Decorator, Component>
  ) {
    const schema = Schema.isSchemaInstance(props.schema) ? props.schema : new Schema(props.schema)

    const renderMarkup = () => {
      if (props.schema) null
      return React.createElement(
        'template',
        {},
        <SchemaMarkupContext.Provider value={schema}>{props.children}</SchemaMarkupContext.Provider>
      )
    }

    const renderChildren = () => {
      return <RecursionField {...props} schema={schema} />
    }
    return (
      <SchemaOptionsContext.Provider value={options}>
        <SchemaComponentsContext.Provider value={{ ...options.components, ...props.components }}>
          {renderMarkup()}
          {renderChildren()}
        </SchemaComponentsContext.Provider>
      </SchemaOptionsContext.Provider>
    )
  }

  return SchemaField
}
