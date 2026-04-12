import { inject, ref } from 'vue'
import { SchemaOptionsSymbol } from '../shared/context'

export const useSchemaOptions = () => inject(SchemaOptionsSymbol, ref())
