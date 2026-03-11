import { withInstall } from '../../../_util/type'
import type { FormItemType } from '../interface'
import type { FieldInterface } from './context'
import type { FunctionalComponent } from 'vue'

export type FieldFC<T extends FormItemType> = FunctionalComponent<FieldInterface<T>> & {
  isSchemaField: boolean
}

const registerBaseField = <T extends FormItemType>(type: T) => {
  const Field: FieldFC<T> = () => {
    return null
  }
  Field.isSchemaField = true
  Field.displayName = `XSchemaField.${type}`
  return withInstall(Field)
}

export default registerBaseField
