import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'
import 'element-plus/es/components/checkbox/style/index'

export const Checkbox = connect(
  ElCheckbox,
  mapProps({ value: 'modelValue' }, (props) => props)
)

export const CheckboxGroup = connect(
  ElCheckboxGroup,
  mapProps({ value: 'modelValue' }, (props) => props)
)
