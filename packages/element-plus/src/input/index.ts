import { ElInput } from 'element-plus'
import { composeExport, connect, mapProps, transformComponent } from '@cjx-low-code/vue'

export type InputType = typeof ElInput

const TransformElInput = transformComponent<InputType>(ElInput, {
  change: 'update:modelValue'
})

export const Textarea: InputType = connect(
  TransformElInput,
  mapProps({ value: 'modelValue' }, (props, field) => ({
    ...props,
    type: 'textarea'
  }))
)
const InnerInput: InputType = connect(
  TransformElInput,
  mapProps({ value: 'modelValue' }, (props, field) => ({
    ...props
  }))
)

export const Input: InputType & {
  Textarea: typeof Textarea
} = composeExport(InnerInput, {
  Textarea
})

export default Input
