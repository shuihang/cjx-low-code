import { inject, provide } from 'vue'
import type { FORM_ON_EVENT_SUFFIX } from '../../../_util/env'
import type { ComputedRef } from 'vue'
import type {
  FormColumnProps,
  FormItemType,
  FormTypeProps,
  FormTypePropsAndEmit,
  GroupInterface,
  InferFormTypePropsType
} from '../interface'

export const schemaProviderKey = Symbol('schemaProviderKey')

type BaseFieldProps = Omit<FormColumnProps, keyof FormTypePropsAndEmit | 'on' | 'type'>

export type FieldPropsOrEmits<T extends FormItemType> = {
  [K in T]?: FormTypeProps[T]
} & { [K in `${T}${typeof FORM_ON_EVENT_SUFFIX}`]?: InferFormTypePropsType<T, 'emit'> }

export type FieldInterface<T extends FormItemType> = BaseFieldProps & FieldPropsOrEmits<T>

export type GroupFieldProps = Omit<GroupInterface, 'column'>

export type SchemaProvide = ComputedRef<{
  addField: (field: BaseFieldProps) => void
  addGroupField: (field: GroupFieldProps) => void
}>

export const useFormProviderKey = (props: SchemaProvide) => {
  return provide(schemaProviderKey, props)
}

export const useFormInjectKey = (): SchemaProvide => {
  return inject(schemaProviderKey) as SchemaProvide
}
