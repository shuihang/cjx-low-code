import { ElTimePicker } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'
import 'element-plus/es/components/time-picker/style/index'

export const TimePicker = connect(
  ElTimePicker,
  mapProps({ value: 'modelValue' }, (props) => props)
)
