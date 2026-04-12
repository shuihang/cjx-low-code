import { toArr } from '@cjx-low-code/shared'
import type { FieldComponent, FieldDecorator } from '../types'

export class BaseField<Decorator = any, Component = any, TextType = any> {
  title?: TextType
  disabled?: boolean
  readOnly?: boolean
  description?: TextType
  decoratorType!: Decorator
  decoratorProps!: Record<string, any>
  componentType!: Component
  componentProps!: Record<string, any>
  slots: any

  get component() {
    return [this.componentType, this.componentProps]
  }

  set component(value: FieldComponent<Component>) {
    const component = toArr(value)

    this.componentType = component[0]
    this.componentProps = component[1] || {}
  }

  get decorator() {
    return [this.decoratorType, this.decoratorProps]
  }

  set decorator(value: FieldDecorator<Decorator>) {
    const decorator = toArr(value)
    this.decoratorType = decorator[0]
    this.decoratorProps = decorator[1] || {}
  }
}
