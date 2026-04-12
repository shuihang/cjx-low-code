import { compile } from './compiler'
import type { Field, IFieldFactoryProps } from '@cjx-low-code/core'
import type { Schema } from './schema'
import type { IFieldStateSetterOptions, ISchema, ISchemaTransformerOptions } from './types'

const setSchemaFieldState = (options: IFieldStateSetterOptions) => {
  const { request, field } = options || {}
  if (!request) return

  if (request.state) {
    field.setState((state) => compile(state, request.state))
  }
  if (request.schema) {
    field.setState((state) => compile(state, request.schema))
  }
}

const getBaseReactions =
  (schema: ISchema, options: ISchemaTransformerOptions) => (field: Field) => {
    setSchemaFieldState({
      field,
      request: { schema }
    })
  }

const getUserReactions = (schema: ISchema, options: ISchemaTransformerOptions) => {
  // const reactions: SchemaReaction[] = toArr(schema['x-reactions'])
  // return reactions.map((unCompiled) => {
  //   return (field: Field) => {
  //     const baseScope = getBaseScope(field, options)
  //     const reaction = shallowCompile(unCompiled, baseScope)
  //     if (!reaction) return
  //     if (isFn(reaction)) {
  //       return reaction(field, baseScope)
  //     }
  //     const { when, fulfill, otherwise, target, effects } = reaction
  //     const run = () => {
  //       const $deps = getDependencies(field, reaction.dependencies)
  //       const $dependencies = $deps
  //       const scope = lazyMerge(baseScope, {
  //         $target: null,
  //         $deps,
  //         $dependencies
  //       })
  //       const compiledWhen = shallowCompile(when, scope)
  //       const condition = when ? compiledWhen : true
  //       const request = condition ? fulfill : otherwise
  //       const runner = request?.run
  //       setSchemaFieldState({
  //         field,
  //         target,
  //         request,
  //         runner,
  //         scope
  //       })
  //     }
  //     if (target) {
  //       reaction.effects = effects?.length ? effects : DefaultFieldEffects
  //     }
  //     if (reaction.effects) {
  //       autorun.memo(() => {
  //         untracked(() => {
  //           each(reaction.effects, (type) => {
  //             if (FieldEffects[type]) {
  //               FieldEffects[type](field.address, run)
  //             }
  //           })
  //         })
  //       }, [])
  //     } else {
  //       run()
  //     }
  //   }
  // })

  return []
}

export const transformFieldProps = (
  schema: Schema,
  options: ISchemaTransformerOptions
): IFieldFactoryProps<any, any> => {
  return {
    name: schema.name,
    reactions: [getBaseReactions(schema, options)].concat(getUserReactions(schema, options))
  }
}
