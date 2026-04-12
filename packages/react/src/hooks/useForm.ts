import { useContext } from 'react'
import { FormContext } from '../shared'
import type { Form } from '@cjx-low-code/core'

export const useForm = <T extends object = any>(): Form<T> => {
  return useContext(FormContext)
}
