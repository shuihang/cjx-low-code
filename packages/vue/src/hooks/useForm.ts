import { inject } from 'vue'
import { FormSymbol } from '../shared/context'

export function useForm() {
  return inject(FormSymbol)
}
