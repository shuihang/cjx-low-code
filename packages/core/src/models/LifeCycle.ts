import type { AnyFunction } from '../types'

export enum LifeCycleTypes {
  ON_FIELD_INIT = 'onFieldInit',
  ON_FIELD_CHANGE = 'onFieldChange',
  ON_FIELD_INPUT = 'onFieldInput',
  ON_FIELD_MOUNT = 'onFieldMount',
  ON_FIELD_UNMOUNT = 'onFieldUnmount',
  ON_FORM_INIT = 'onFormInit',
  ON_FORM_MOUNT = 'onFormMount',
  ON_FORM_UNMOUNT = 'onFormUnmount',
  ON_FORM_VALUES_CHANGE = 'onFormValuesChange'
}

export class LifeCycle<Payload = any, Context = any> {
  type: string
  callback: (payload: Payload, context: Context) => void

  constructor(type: string, callback: (payload: Payload, context: Context) => void) {
    this.type = type
    this.callback = callback
  }
}
