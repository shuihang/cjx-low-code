import { ElCascader } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'

export const Cascader: typeof ElCascader = connect(
  ElCascader,
  mapProps({ value: 'modelValue' }, (props) => props)
)
