import { inject, ref } from 'vue'
import { FieldSymbol } from '../shared/context'
import type { Ref } from 'vue'
import type { GeneralField } from '@cjx-low-code/core'

export const useField = <T = GeneralField>(): Ref<T> => {
  return inject(FieldSymbol, ref()) as any
}
