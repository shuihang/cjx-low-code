import { type Ref, inject, ref } from 'vue'
import { SchemaMarkupSymbol } from '../shared/context'
import type { Schema } from '@cjx-low-code/json-schema'

export const useSchemaMarkup: () => Ref<InstanceType<typeof Schema>> = () =>
  inject(SchemaMarkupSymbol, ref(null))
