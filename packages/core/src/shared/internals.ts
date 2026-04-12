import { FormPath, isFunction, isString, isValid } from '@cjx-low-code/shared'
import { batch } from '@cjx-low-code/reactivity'
import { isGeneralField } from './checkers'
import { MutuallyExclusiveProperties, ReadOnlyProperties, ReservedProperties } from './constants'
import type { Field } from '../models'
import type { Form } from '../models/Form'
import type { FieldMatchPattern } from '../types'

const hasOwnProperty = Object.prototype.hasOwnProperty

export const isHTMLInputEvent = (event: any, stopPropagation = true) => {
  if (event?.target) {
    if (typeof event.target === 'object' && ('value' in event.target || 'checked' in event.target))
      return true
    if (stopPropagation) event.stopPropagation?.()
  }
  return false
}

export const getValuesFromEvent = (args: any[]) => {
  return args.map((event) => {
    if (event?.target) {
      if (isValid(event.target.value)) return event.target.value
      if (isValid(event.target.checked)) return event.target.checked
      return null
    }
    return event
  })
}

/**
 * deserialize - 反序列化状态设置器
 *
 * 用于反序列化状态设置器，处理互斥属性和函数属性
 */
export const deserialize = (model: Field, setter: any) => {
  if (!model) return
  if (isFunction(setter)) {
    setter(model.state)
  } else {
    const target = model.state || model
    for (const key in setter) {
      if (!hasOwnProperty.call(setter, key)) continue
      if (ReadOnlyProperties[key] || ReservedProperties[key]) continue
      const MutuallyExclusiveKey = MutuallyExclusiveProperties[key]
      if (
        MutuallyExclusiveKey &&
        hasOwnProperty.call(setter, MutuallyExclusiveKey) &&
        !isValid(setter[MutuallyExclusiveKey])
      )
        continue
      const value = setter[key]
      if (isFunction(value)) continue
      target[key] = value
    }
  }
  return model
}

export const createStateSetter = (model: Field) => {
  return batch.bound((setter?: any) => deserialize(model, setter))
}

/**
 * 创建批量状态设置器
 *
 * 用于批量设置多个字段的状态
 */
export const createBatchStateSetter = (form: Form) => {
  return batch.bound((pattern: FieldMatchPattern, payload?: any) => {
    if (isGeneralField(pattern)) {
      pattern.setState(payload)
    } else {
      const patternStr = isString(pattern) ? pattern : String(pattern)
      form.query(patternStr).forEach((field) => {
        field.setState(payload)
      })
    }
  })
}
