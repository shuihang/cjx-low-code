import { Field } from '@cjx-low-code/core'
import type { JSXComponent } from '../types'

export class ObjectField<
  Decorator extends JSXComponent = any,
  Component extends JSXComponent = any
> extends Field<Decorator, Component, any, Record<string, any>> {}
