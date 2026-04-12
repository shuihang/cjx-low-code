import { ElInput } from 'element-plus'
import { connect, mapProps, transformComponent } from '@cjx-low-code/vue'
import 'element-plus/es/components/input/style/index'

export type InputProps = typeof ElInput

const TransformElInput = transformComponent<InputProps>(ElInput, {
  change: 'update:modelValue'
})

export const Input = connect(
  TransformElInput,
  mapProps({ value: 'modelValue' }, (props, field) => ({
    ...props
  }))
)

export default Input
