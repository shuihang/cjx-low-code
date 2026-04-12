import { ElTimeSelect } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'
import 'element-plus/es/components/time-select/style/index'

export const TimeSelect = connect(
  ElTimeSelect,
  mapProps({ value: 'modelValue' }, (props) => props)
)
