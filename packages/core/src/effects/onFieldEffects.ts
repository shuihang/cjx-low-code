import { isFunction, toArr } from '@cjx-low-code/shared'
import { batch, reaction } from '@cjx-low-code/reactivity'
import { createEffectHook, useEffectForm } from '../shared/effective'
import { LifeCycleTypes } from '../models/LifeCycle'
import type { FormPathPattern, GeneralField, IFieldState } from '../types'
import type { Form } from '../models'

function matchFieldPath(pattern: FormPathPattern, field: GeneralField): boolean {
  if (typeof pattern === 'string') {
    // pattern === field.name || pattern === field.address || pattern === field.path
    return pattern === field.name || pattern === field.path
  }
  if (pattern instanceof RegExp) {
    // pattern.test(field.name) || pattern.test(field.address) || pattern.test(field.path)
    return pattern.test(field.name) || pattern.test(field.path)
  }
  if (Array.isArray(pattern)) {
    // pathStr === field.name || pathStr === field.address || pathStr === field.path
    const pathStr = pattern.join('.')
    return pathStr === field.name || pathStr === field.path
  }
  return false
}

function createFieldEffect<Result extends GeneralField = GeneralField>(type: LifeCycleTypes) {
  return createEffectHook(
    type,
    (field: Result, form: Form) =>
      (pattern: FormPathPattern, callback: (field: Result, form: Form) => void) => {
        if (matchFieldPath(pattern, field)) {
          batch(() => {
            callback(field, form)
          })
        }
      }
  )
}

const _onFieldInit = createFieldEffect(LifeCycleTypes.ON_FIELD_INIT)

export function onFieldInit(
  pattern: FormPathPattern,
  callback?: (field: GeneralField, form: Form) => void
) {
  const form = useEffectForm()
  const patternStr = typeof pattern === 'string' ? pattern : String(pattern)
  const fields = form.query(patternStr)

  if (fields.length > 0) {
    fields.forEach((field) => {
      if (isFunction(callback)) {
        callback(field, form)
      }
    })
  } else {
    _onFieldInit(pattern, callback!)
  }
}

export function onFieldChange(
  pattern: FormPathPattern,
  callback?: (field: GeneralField, form: Form) => void
): void
export function onFieldChange(
  pattern: FormPathPattern,
  watches: (keyof IFieldState)[],
  callback?: (field: GeneralField, form: Form) => void
): void
export function onFieldChange(
  pattern: FormPathPattern,
  watches: any,
  callback?: (field: GeneralField, form: Form) => void
): void {
  if (isFunction(watches)) {
    callback = watches
    watches = ['value']
  } else {
    watches = watches || ['value']
  }
  onFieldInit(pattern, (field, form) => {
    if (isFunction(callback)) callback(field, form)
    const dispose = reaction(
      () => {
        return toArr(watches).map((key) => {
          return field.state[key as keyof IFieldState]
        })
      },
      () => {
        if (isFunction(callback)) callback(field, form)
      }
    )
    field.form.effectDisposers.push(dispose)
  })
}
