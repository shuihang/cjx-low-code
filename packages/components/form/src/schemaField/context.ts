import { isVNode } from 'vue'
import { FORM_ON_EVENT_SUFFIX } from '../../../_util/env'
import { schemaLayoutValues } from './interface'
import type { VNode } from 'vue'
import type {
  FormItemType,
  FormTypeProps,
  FormTypePropsAndEmit,
  InferFormTypePropsType
} from '../interface'
import type {
  NormalField,
  SchemaItem,
  SchemaItemArray,
  SchemaLayout,
  SchemaLayoutType
} from './interface'

export const schemaProviderKey = Symbol('schemaProviderKey')

type BaseFieldProps = Omit<NormalField, keyof FormTypePropsAndEmit | 'on' | 'type' | 'order'>

export type FieldPropsOrEmits<T extends FormItemType> = {
  [K in T]?: FormTypeProps[T]
} & { [K in `${T}${typeof FORM_ON_EVENT_SUFFIX}`]?: InferFormTypePropsType<T, 'emit'> }

export type FieldInterface<T extends FormItemType> = BaseFieldProps & FieldPropsOrEmits<T>

export const getChildComponentNameSlots = (VNode: VNode[]): VNode[] => {
  const nodes = VNode.filter(
    (n): n is VNode => isVNode(n) && (n.type as any)?.displayName?.startsWith('XSchemaField')
  )
  return nodes
}

export const collectFields = (vnodes: VNode[] | undefined): SchemaItemArray => {
  const fields: SchemaItemArray = []

  const schemaFieldNodes = vnodes ? getChildComponentNameSlots(vnodes) : []
  schemaFieldNodes.forEach((vnode) => {
    const field = vnode.props as SchemaItem

    const type = (vnode?.type as any)?.displayName
      ?.replace('XSchemaField.', '')
      .toLowerCase() as FormItemType

    // vue组件的prop 可能会有 短横线分隔格式 或 驼峰命名格式
    const eventProp =
      (field[`${type}-event`] as unknown as FieldInterface<
        typeof type
      >[`${typeof type}${typeof FORM_ON_EVENT_SUFFIX}`]) || field[`${type}${FORM_ON_EVENT_SUFFIX}`]

    if (field?.prop) {
      const schemaItem: SchemaItem = {
        ...field,
        type
      }
      // 处理布局类型
      if (schemaLayoutValues.includes(type as SchemaLayoutType)) {
        ;(schemaItem as SchemaLayout).column = vnode?.children
          ? collectFields((vnode?.children as any)?.default())
          : []
      } else {
        schemaItem.dicData = field.dicData || field['dic-data']
        schemaItem.on = {
          [type + FORM_ON_EVENT_SUFFIX]: eventProp
        }
        delete schemaItem['dic-data']
        delete schemaItem[`${type}-event`]
      }

      fields.push(schemaItem)
    }
  })

  console.log(fields)
  return fields
}
