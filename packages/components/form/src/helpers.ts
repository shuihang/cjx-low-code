import { clone } from 'lodash-unified'
import type { FormModelValueType, PropKey, SchemaItemArray, SchemaProvide } from './interface'
import type { TemplateCommonProps } from './init/initFormTamplate'

type IgnoreKeys = 'on' | 'prop'

const IGNORE_KEYS: IgnoreKeys[] = ['on', 'prop']

/**
 * 表单辅助函数
 * @description 用于更新表单列配置和表单数据
 * @param columns 表单列配置
 * @param form 表单数据
 */
export default function helpers<
  F extends object = FormModelValueType,
  P extends PropKey<F> = PropKey<F>
>(data: {
  schemaField: SchemaItemArray<F, P>
  currentField: SchemaProvide<F, P>
  onUpdateModelValue: TemplateCommonProps['onUpdateModelValue']
}) {
  const { schemaField, currentField, onUpdateModelValue } = data
  return {
    /**
     * 更新表单列配置
     * @param fields 需要更新的表单列 column.prop updateSchemaField(['name', 'age'], { label: '姓名' })
     * @param column 更新的表单列配置
     */
    updateSchemaField: (fields: P[], column: Partial<Omit<SchemaProvide<F>, IgnoreKeys>>) => {
      schemaField.forEach((item, index) => {
        if (fields.includes(item.prop as P)) {
          // 使用IGNORE_KEYS动态保留需要忽略的属性
          const preservedProps = IGNORE_KEYS.reduce((acc, key) => {
            const typedKey = key
            if (typedKey in item) {
              acc[key as IgnoreKeys] = item[typedKey] as any
            }
            return acc
          }, {} as Pick<SchemaProvide<F>, IgnoreKeys>)

          schemaField[index] = {
            ...item,
            ...column,
            ...preservedProps
          }
        }
      })
    },
    /**
     * 更新表单数据
     * @param value 需要更改的表单数据
     */
    updateForm(value: Partial<F>) {
      for (const key in value) {
        onUpdateModelValue(key, value[key])
      }
    },
    /**
     * 当前列配置
     */
    currentField: clone(currentField)
  }
}

export type FormHelper<
  F extends object = FormModelValueType,
  P extends PropKey<F> = PropKey<F>
> = ReturnType<typeof helpers<F, P>>
