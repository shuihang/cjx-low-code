import { defineComponent } from 'vue'
import { arrayType } from '@cjx-low-code/shared'
import { useFormInjectKey } from '../context'
import { InitFormTemplate } from '../init'
import type { CustomSlotsType } from '@cjx-low-code/shared'
import type { SchemaItemArray } from '../interface'

export default defineComponent({
  name: 'XFormColumn',
  props: {
    schemaField: arrayType<SchemaItemArray>()
  },
  slots: Object as CustomSlotsType<object>,
  render() {
    const { isView, ...otherProps } = useFormInjectKey().value
    return InitFormTemplate({
      ...this.$props,
      ...otherProps,
      isView: isView.value,
      slots: this.$slots
    })
  }
})
