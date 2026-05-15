import { ElSlider } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'

export const Slider: typeof ElSlider = connect(
  ElSlider,
  mapProps({ value: 'modelValue' }, (props) => props)
)
