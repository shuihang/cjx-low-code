import { ElFormItem } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'

export const FormItem = connect(
  ElFormItem,
  mapProps({ title: 'label', name: 'prop' }, (props, field) => ({
    ...props
  }))
)

export default FormItem
