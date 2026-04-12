import { ElRate } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'

export const Rate = connect(
  ElRate,
  mapProps({ value: 'modelValue' }, (props) => props)
)
