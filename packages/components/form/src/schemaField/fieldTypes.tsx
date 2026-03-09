import { inputProps, selectProps } from 'element-plus'
import registerBaseField from './registerBaseField'

export const registerFieldTypes = (SchemaField: any) => {
  // 字段类型组件
  SchemaField.Input = registerBaseField(inputProps, 'input')

  SchemaField.Select = registerBaseField(selectProps, 'select')
}
