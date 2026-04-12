import { Form as AntdForm } from 'antd'
import { connect, mapProps } from '@cjx-low-code/react'

const Form: typeof AntdForm = AntdForm

;(Form.Item as any) = connect(
  Form.Item,
  mapProps({ title: 'label' }, (props, field) => ({
    ...props
  }))
)

export { Form }

export default Form
