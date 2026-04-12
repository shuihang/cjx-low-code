import { ElSelect } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'

export const Select: typeof ElSelect = connect(
  ElSelect,
  mapProps({ value: 'modelValue' }, (props) => props)
)
