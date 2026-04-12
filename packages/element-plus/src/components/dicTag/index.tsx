import { defineComponent } from 'vue'
import type { CSSProperties, PropType } from 'vue'
import type { AnyObject } from '@cjx-low-code/shared'

export const tagColor = {
  primary: '#409eff',
  success: '#67C23A',
  warning: '#E6A23C',
  danger: '#F56C6C',
  info: '#909399',
  default: '#909399',
  purple: '#8f58e5',
  darkGreen: '#00BFBF',
  lightYellow: '#fee100'
}

export type ColorTypeInterface = keyof typeof tagColor

export type DicDataInterface = Array<
  {
    // label: string,
    // value: string | number,
    colorType?: ColorTypeInterface
  } & AnyObject
>

export default defineComponent({
  name: 'XDicTag',
  props: {
    colorType: {
      type: String as PropType<ColorTypeInterface>,
      require: true,
      default: 'default'
    },
    label: {
      type: String,
      default: '',
      require: true
    }
  },
  setup(props) {
    return () => (
      <>
        <div style={{ display: 'flex', alignItems: 'center' } as CSSProperties}>
          <div
            style={
              {
                backgroundColor: tagColor[props.colorType],
                borderRadius: '1em',
                width: '0.4em',
                height: '0.4em',
                marginRight: '0.4em'
              } as CSSProperties
            }
          ></div>
          <div style={{ color: tagColor[props.colorType] } as CSSProperties}>{props.label}</div>
        </div>
      </>
    )
  }
})
