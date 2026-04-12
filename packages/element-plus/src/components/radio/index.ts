import { ElRadio, ElRadioGroup } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'
import 'element-plus/es/components/radio/style/index'

export const Radio = connect(
  ElRadio,
  mapProps({ value: 'modelValue' }, (props) => props)
)

export const RadioGroup = connect(
  ElRadioGroup,
  mapProps({ value: 'modelValue' }, (props) => props)
)
