import { Form } from '../models/Form'
import { Field } from '../models/Field'

import type { GeneralField, JSXComponent } from '../types'

export const isForm = (node: any): node is Form => {
  return node instanceof Form
}

export const isGeneralField = (node: any): node is GeneralField => {
  return node instanceof Field // || node instanceof VoidField
}

export const isField = <
  Decorator extends JSXComponent = any,
  Component extends JSXComponent = any,
  TextType = any,
  ValueType = any
>(
  node: any
): node is Field<Decorator, Component, TextType, ValueType> => {
  return node instanceof Field
}
