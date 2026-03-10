import { FORM_ON_EVENT_SUFFIX } from '../../../_util/env'
import { withInstall } from '../../../_util/type'
import { useFormInjectKey } from './context'
import type { FormItemType } from '../interface'
import type { FieldInterface } from './context'
import type { FunctionalComponent } from 'vue'

// 将短横线分隔格式转换为驼峰命名
const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

export type FieldFC<T extends FormItemType> = FunctionalComponent<FieldInterface<T>> & {
  isSchemaField: boolean
}

const registerBaseField = <T extends FormItemType>(type: T) => {
  const Field: FieldFC<T> = (props) => {
    const schemaField = useFormInjectKey()

    // 支持多种事件属性格式
    const eventProp =
      (props[
        `${type}-event`
      ] as unknown as FieldInterface<T>[`${T}${typeof FORM_ON_EVENT_SUFFIX}`]) ||
      props[`${type}${FORM_ON_EVENT_SUFFIX}`]

    schemaField.value.addField({
      ...props,
      type,
      on: {
        [`${kebabToCamel(type)}${FORM_ON_EVENT_SUFFIX}`]: eventProp
      }
    })

    return null
  }
  Field.isSchemaField = true
  Field.displayName = `XSchemaField.${type}`
  return withInstall(Field)
}

export default registerBaseField
