import { isFunction, toArr } from '@cjx-low-code/shared'
import { isObservable } from '@cjx-low-code/reactivity'
import { Schema } from './schema'

const REVA_ACTIONS_KEY = Symbol.for('__REVA_ACTIONS')

export const SchemaNestedMap = {
  parent: true,
  root: true,
  properties: true,
  patternProperties: true,
  additionalProperties: true,
  items: true,
  additionalItems: true,
  // 关联字段
  linkages: true,
  // 反应字段
  reactions: true
}

export const SchemaValidatorMap = {
  required: true,
  format: true,
  maxItems: true,
  minItems: true,
  maxLength: true,
  minLength: true,
  maximum: true,
  minimum: true,
  exclusiveMaximum: true,
  exclusiveMinimum: true,
  pattern: true,
  const: true,
  multipleOf: true,
  maxProperties: true,
  minProperties: true,
  uniqueItems: true
}

export const SchemaValidatorKeys = Object.keys(SchemaValidatorMap)

export const hasOwnProperty = Object.prototype.hasOwnProperty

export const isNoNeedCompileObject = (source: any) => {
  if ('$$typeof' in source && '_owner' in source) {
    return true
  }
  if (source['_isAMomentObject']) {
    return true
  }
  if (Schema.isSchemaInstance(source)) {
    return true
  }
  if (source[REVA_ACTIONS_KEY]) {
    return true
  }
  if (isFunction(source['toJS'])) {
    return true
  }
  if (isFunction(source['toJSON'])) {
    return true
  }
  if (isObservable(source)) {
    return true
  }
  return false
}

export const createDataSource = (source: any[]) => {
  return toArr(source).map((item) => {
    if (typeof item === 'object') {
      return item
    } else {
      return {
        label: item,
        value: item
      }
    }
  })
}
