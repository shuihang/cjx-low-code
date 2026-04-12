import { useContext } from 'react'
import { FieldContext } from '../shared'
import type { GeneralField } from '@cjx-low-code/core'

export const useField = <T = GeneralField>(): T => {
  return useContext(FieldContext) as any
}
