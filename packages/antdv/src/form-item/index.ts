import { FormItem as AntFormItem } from 'ant-design-vue'
import { connect, mapProps } from '@cjx-low-code/vue'

type FormItemType = typeof AntFormItem

export const FormItem: FormItemType = connect(
  AntFormItem,
  mapProps({ title: 'label', name: 'name' }, (props, field) => ({
    ...props
  }))
)
