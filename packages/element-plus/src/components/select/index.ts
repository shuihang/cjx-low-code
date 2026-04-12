import { ElSelect } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'
import 'element-plus/es/components/select/style/index'

export const Select = connect(
  ElSelect,
  mapProps({ value: 'modelValue' }, (props) => props)
)
