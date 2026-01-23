import { clone } from 'lodash-es'
import type { FormColumnProps, FormModelValueType } from './interface'
import type { TemplateCommonProps } from './init/initFormTamplate'

type IgnoreKeys = 'on' | 'prop'

const IGNORE_KEYS: IgnoreKeys[] = ['on', 'prop']
 
/**
 * 表单辅助函数
 * @description 用于更新表单列配置和表单数据
 * @param columns 表单列配置
 * @param form 表单数据
 */
export default function helpers<F extends object = FormModelValueType>(data: {
  columns: FormColumnProps<F>[],
  currentColumn: FormColumnProps<F>
  onUpdateModelValue: TemplateCommonProps['onUpdateModelValue']
}) {
  const { columns, currentColumn, onUpdateModelValue } = data
  return {
    /**
     * 更新表单列配置
     * @param fields 需要更新的表单列 column.prop updateColumns(['name', 'age'], { label: '姓名' })
     * @param column 更新的表单列配置 
     */
    updateColumns: (fields: string[], column: Partial<Omit<FormColumnProps<F>, IgnoreKeys>>) => {
      columns.forEach((item, index) => {
        if (fields.includes(item.prop)) {
          // 使用IGNORE_KEYS动态保留需要忽略的属性
          const preservedProps = IGNORE_KEYS.reduce((acc, key) => {
            const typedKey = key
            if (typedKey in item) {
              acc[key as IgnoreKeys] = item[typedKey] as any
            }
            return acc
          }, {} as Pick<FormColumnProps<F>, IgnoreKeys>)
          
          columns[index] = {
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
    currentColumn: clone(currentColumn)
  }
}

export type FormHelper<F extends object = FormModelValueType> = ReturnType<typeof helpers<F>>
