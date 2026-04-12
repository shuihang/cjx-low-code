import { inject, ref } from 'vue'
import { SchemaSymbol } from '../shared/context'

export const useFieldSchema = () => inject(SchemaSymbol, ref())
