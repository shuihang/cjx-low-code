import { FormItem as AntFormItem } from 'ant-design-vue'
import { connect, mapProps } from '@cjx-low-code/vue'

export const FormItem = connect(
  AntFormItem,
  mapProps({ title: 'label', name: 'name' }, (props, field) => ({
    ...props
  }))
)
