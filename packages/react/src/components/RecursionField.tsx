import React, { Fragment, useContext, useMemo } from 'react'
import { Schema } from '@cjx-low-code/json-schema'
import { observable } from '@cjx-low-code/reactivity'
import { FormPath, isBoolean, isFunction, isValid } from '@cjx-low-code/shared'
import { SchemaComponentsContext, SchemaContext } from '../shared'
import { useField } from '../hooks'
import { ObjectField } from './ObjectField'
import { Field } from './Field'
import { ReactiveField } from './ReactiveField'
import type { GeneralField } from '@cjx-low-code/core'
import type { IRecursionFieldProps, ReactFC } from '../types'

const useFieldProps = (schema: Schema) => {
  const components = useContext(SchemaComponentsContext)
  return schema.toFieldProps(components) as any
}

const useBasePath = (props: IRecursionFieldProps) => {
  const parent = useField()
  return props.basePath || parent?.address
}

export const RecursionField: ReactFC<IRecursionFieldProps> = (props) => {
  const basePath = useBasePath(props)
  const fieldSchema = useMemo(() => new Schema(props.schema), [props.schema])
  const fieldProps = useFieldProps(fieldSchema)
  console.log('fieldProps', fieldProps)

  // const renderSlots = (innerSchema, key) => {
  //   const slot = innerSchema['x-slot-node']
  //   const { target, isRenderProp } = slot
  //   if (isRenderProp) {
  //     FormPath.setIn(fieldSchema.properties, target, (..._args: any) => {
  //       return <RecursionField schema={innerSchema} name={key} />
  //     })
  //   } else {
  //     FormPath.setIn(
  //       fieldSchema.properties,
  //       target,
  //       <RecursionField schema={innerSchema} name={key} />
  //     )
  //   }
  // }

  // const renderProperties = (field?: GeneralField) => {
  //   const properties = Schema.getOrderProperties(fieldSchema)
  //   if (!properties.length) return
  //   return (
  //     <Fragment>
  //       {properties.map(({ schema: item, key: name }, index) => {
  //         const base = field?.address || basePath
  //         const schema: Schema = item
  //         if (schema['x-slot-node']) {
  //           renderSlots(schema, name)
  //           return null
  //         }

  //         return (
  //           <RecursionField schema={schema} key={`${index}-${name}`} name={name} basePath={base} />
  //         )
  //       })}
  //     </Fragment>
  //   )
  // }

  const render = () => {
    const schemas = [] // Schema.getSchemas(fieldSchema)

    if (!schemas.length) return

    const vNode: React.ReactNode[] = []
    schemas.forEach((schema, index) => {
      vNode.push(
        React.createElement(
          Field,
          {
            key: `${index}-${schema.name}`,
            ...schema
          } as any,
          {
            ...schema.slots
          }
        )
      )
    })

    return vNode

    // if (!isValid(props.name)) return renderProperties()
    // if (fieldSchema.type === 'object') {
    //   if (props.onlyRenderProperties) return renderProperties()
    //   return (
    //     <ObjectField {...fieldProps} name={props.name} basePath={basePath}>
    //       {renderProperties}
    //     </ObjectField>
    //   )
    // } else if (fieldSchema.type === 'array') {
    //   return <ArrayField {...fieldProps} name={props.name} basePath={basePath} />
    // } else if (fieldSchema.type === 'void') {
    //   return (
    //     <VoidField {...fieldProps} name={props.name} basePath={basePath}>
    //       {renderProperties}
    //     </VoidField>
    //   )
    // }
    // return <Field {...fieldProps} name={props.name} basePath={basePath} />
  }

  if (!fieldSchema) return <Fragment />

  return <SchemaContext.Provider value={fieldSchema}>{render()}</SchemaContext.Provider>
}
