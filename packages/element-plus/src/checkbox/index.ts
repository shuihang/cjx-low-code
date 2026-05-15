import { defineComponent, h } from 'vue'
import { ElCheckbox, ElCheckboxGroup, checkboxGroupProps } from 'element-plus'
import { connect, mapProps } from '@cjx-low-code/vue'

type OptionRow = { label?: string; value?: string | number | boolean; disabled?: boolean }

/** 用插槽渲染 options，避免 options 仅作为 DOM 属性而无法驱动 CheckboxGroup */
const CheckboxGroupWithOptions = defineComponent({
  name: 'Checkbox',
  inheritAttrs: false,
  props: checkboxGroupProps,
  setup(_, { attrs, slots }) {
    return () => {
      const raw = { ...attrs } as Record<string, unknown>
      const optSource = raw.options ?? raw.dicData
      const list: OptionRow[] = Array.isArray(optSource) ? (optSource as OptionRow[]) : []
      const { options: _o, dicData: _d, ...groupAttrs } = raw
      return h(ElCheckboxGroup, groupAttrs, {
        ...slots,
        default: () =>
          list.map((opt, index) =>
            h(
              ElCheckbox,
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

export const Checkbox = connect(
  CheckboxGroupWithOptions,
  mapProps({ value: 'modelValue' }, (props) => props)
)
