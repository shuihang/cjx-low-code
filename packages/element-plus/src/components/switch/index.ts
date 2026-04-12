import { ElSwitch } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'
import 'element-plus/es/components/switch/style/index'

export const Switch = connect(
  ElSwitch,
  mapProps({ value: 'modelValue' }, (props) => props)
)
