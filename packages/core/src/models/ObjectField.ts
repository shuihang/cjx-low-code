import { reaction } from '@cjx-low-code/reactivity'
import { Field } from './Field'
import type { FormPathPattern, IFieldProps, JSXComponent } from '../types'
import type { Form } from './Form'

export class ObjectField<
  Decorator extends JSXComponent = any,
  Component extends JSXComponent = any
> extends Field<Decorator, Component, any, Record<string, any>> {
  displayName = 'ObjectField'
  private additionalProperties: string[] = []
  constructor(address: FormPathPattern, props: IFieldProps<Decorator, Component>, form: Form) {
    super(address, props, form)
  }

  addProperty = (key: string, value: any) => {
    this.additionalProperties.push(key)
    return this.onInput(this.value)
  }

  removeProperty = (key: string) => {
    this.additionalProperties.splice(this.additionalProperties.indexOf(key), 1)
    return this.onInput(this.value)
  }
}
