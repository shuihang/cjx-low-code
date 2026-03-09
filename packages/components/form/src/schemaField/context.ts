import { inject, provide } from 'vue'
import type { ComputedRef } from 'vue'

export const schemaProviderKey = Symbol('schemaProviderKey')

export type FieldInterface = {
  type: string
}

export type SchemaProvide = ComputedRef<{
  addField: (field: FieldInterface) => void
}>

export const useFormProviderKey = (props: SchemaProvide) => {
  return provide(schemaProviderKey, props)
}

export const useFormInjectKey = (): SchemaProvide => {
  return inject(schemaProviderKey) as SchemaProvide
}
