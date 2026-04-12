import { ElCascader } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'
import 'element-plus/es/components/cascader/style/index'

export const Cascader = connect(
  ElCascader,
  mapProps({ value: 'modelValue' }, (props) => props)
)
