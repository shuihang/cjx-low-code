import { Form as AntdForm } from 'antd'
import { connect, mapProps } from '@cjx-low-code/react'

export const Form = AntdForm

Form.Item = connect(
  Form.Item,
  mapProps({ title: 'label' }, (props, field) => ({
    ...props
  }))
)

export default Form
