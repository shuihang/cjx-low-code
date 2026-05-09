import { App, defineComponent, ref, watch } from 'vue'
import { useEyeDropper } from '@vueuse/core'
import { getRgbColor } from './getAlphaColor'
import { withInstall } from '@/utils/type'

import './style/index.scss'

const { open, sRGBHex } = useEyeDropper()

const colorList = [
  '#ffffff',
  '#1677ff',
  '#00b96b',
  '#F5222D',
  '#ff8000',
  '#ffff00',
  '#00ffff',
  '#cccccc',
  '#000000',
  'transparent'
]

const BColorPicker = withInstall(
  defineComponent({
    name: 'ColorPicker',
    props: {
      defaultColor: {
        type: String,
        default: '#000000'
      },
      format: {
        type: String,
        // hex rgb
        default: 'rgb'
      }
    },
    emits: ['change'],
    setup(props, { emit }) {
      const selectColor = ref<string>(props.defaultColor)

      //获取颜色盘的颜色
      const updateColor = (event) => {
        selectColor.value = event.target.value
      }

      const selectColorChange = (color: string) => {
        selectColor.value = color
      }

      //监听滴管颜色
      watch(sRGBHex, async (newModelValue) => {
        if (newModelValue) {
          selectColor.value = newModelValue
          // console.log(newModelValue)
        }
      })

      //监听值的变化
      watch(selectColor, async (newValue) => {
        if (newValue) {
          emit('change', props.format === 'rgb' ? getRgbColor(newValue) : newValue)
        }
      })

      return () => {
        return (
          <div class="x-color-picker">
            <div class="active-color">
              <input
                type="color"
                value={selectColor.value}
                onInput={updateColor}
                class={['color', selectColor.value]}
              />
            </div>

            <div class="select-color-right">
              {colorList.map((item, index) => {
                return (
                  <button
                    key={index}
                    class={[`select-color-item`, item]}
                    style={[{ backgroundColor: item }]}
                    onClick={() => {
                      selectColorChange(item)
                    }}
                  ></button>
                )
              })}
            </div>
          </div>
        )
      }
    }
  })
)

// BColorPicker.install = (app: App) => {
//   app.component(BColorPicker.name, BColorPicker);
// };

export default BColorPicker
