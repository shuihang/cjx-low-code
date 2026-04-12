import { FormItem as AntFormItem } from 'ant-design-vue'
import { connect, mapProps } from '@cjx-low-code/vue'
import type { FormItem as AntFormItemType } from 'ant-design-vue'

export const FormItem: typeof AntFormItemType = connect(
  AntFormItem,
  mapProps({ title: 'label', name: 'name' }, (props, field) => ({
    ...props
  }))
)
