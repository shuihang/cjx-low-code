import { ElTimeSelect } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'

export const TimeSelect: typeof ElTimeSelect = connect(
  ElTimeSelect,
  mapProps({ value: 'modelValue' }, (props) => props)
)
