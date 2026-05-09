import { ElInputNumber } from 'element-plus'
import { connect, mapProps, transformComponent } from '@cjx-low-code/vue'

export type InputNumberType = typeof ElInputNumber

const TransformElInputNumber = transformComponent<InputNumberType>(ElInputNumber, {
  change: 'update:modelValue'
})

export const InputNumber: InputNumberType = connect(
  TransformElInputNumber,
  mapProps({ value: 'modelValue' }, (props, field) => ({
    ...props
  }))
)

export default InputNumber
