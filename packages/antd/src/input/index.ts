import { Input as AntdInput } from 'antd'
import { connect } from '@cjx-low-code/react'

const Input: typeof AntdInput = connect(AntdInput) as typeof AntdInput

Input.Group = connect(AntdInput.Group) as typeof AntdInput.Group
Input.Search = connect(AntdInput.Search)
Input.TextArea = connect(AntdInput.TextArea)
Input.Password = connect(AntdInput.Password)

export { Input }

export default Input
