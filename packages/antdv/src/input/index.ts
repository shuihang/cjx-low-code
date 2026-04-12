import { Input as AntInput } from 'ant-design-vue'
import { composeExport, connect, mapProps } from '@cjx-low-code/vue'
import type { Input as AntInputType } from 'ant-design-vue'

const InnerInput = connect(
  AntInput,
  mapProps((props, field) => ({
    ...props
  }))
)

const InputSearch = connect(AntInput.Search)
const InputGroup = connect(AntInput.Group)
const InputPassword = connect(AntInput.Password)
const InputTextArea = connect(AntInput.TextArea)

export const Input: typeof AntInputType = composeExport(InnerInput, {
  Search: InputSearch,
  Group: InputGroup,
  Password: InputPassword,
  TextArea: InputTextArea
})

export default Input
