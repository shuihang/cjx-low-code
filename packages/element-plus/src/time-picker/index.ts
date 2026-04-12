import { ElTimePicker } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'

export const TimePicker: typeof ElTimePicker = connect(
  ElTimePicker,
  mapProps({ value: 'modelValue' }, (props) => props)
)
