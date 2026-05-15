import { defineComponent, h } from 'vue'
import { ElRadio, ElRadioGroup } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'

type OptionRow = { label?: string; value?: string | number | boolean; disabled?: boolean }

/** 用插槽渲染 options：经 connect / ReactiveField 传入的 options 有时不会作为 EP RadioGroup 的 prop 生效，而是落到 DOM 上 */
const RadioGroupWithOptions = defineComponent({
  name: 'Radio',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => {
      const raw = { ...attrs } as Record<string, unknown>
      const optSource = raw.options ?? raw.dicData
      const list: OptionRow[] = Array.isArray(optSource) ? (optSource as OptionRow[]) : []
      const { options: _o, dicData: _d, ...groupAttrs } = raw
      return h(ElRadioGroup, groupAttrs, {
        ...slots,
        default: () =>
          list.map((opt, index) =>
            h(
              ElRadio,
              {
                key: index,
                value: opt.value,
                disabled: opt.disabled
              },
              () => (opt.label != null ? String(opt.label) : String(opt.value ?? ''))
            )
          )
      })
    }
  }
})

export const Radio = connect(
  RadioGroupWithOptions,
  mapProps({ value: 'modelValue' }, (props) => props)
)
