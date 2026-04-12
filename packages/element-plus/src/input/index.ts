import { ElInput } from 'element-plus'
import { connect, mapProps, transformComponent } from '@cjx-low-code/vue'

export type InputProps = typeof ElInput

const TransformElInput = transformComponent<InputProps>(ElInput, {
  change: 'update:modelValue'
})

export const Input: InputProps = connect(
  TransformElInput,
  mapProps({ value: 'modelValue' }, (props, field) => ({
    ...props
  }))
)

export default Input
